import datetime
import os
from base64 import b64encode

from django.db.models.functions import ExtractMonth
from django.utils import timezone

from django.db.models import Count
from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import filters

from backend import settings
from backend.Google import create_spreadsheet, spreadsheet_top_insert, spreadsheet_append, spreadsheet_get_data, \
    spreadsheet_delete_row
from .serializers import ExamSerializer, Exam, Subject, Question, QuestionSerializer, School, SchoolSerializer, Result, \
    ResultSerializer, ResultSingleSerializer, StudentSerializer, StudentApplied, Student, AppliedStudentSerializer, \
    NotificationSerializer, Choice, CourseRecommended, ResultDetails
from rest_framework.permissions import IsAuthenticated
import pandas as pd

class ExamViewSet(mixins.ListModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet, ):
    serializer_class = ExamSerializer
    queryset = Exam.objects.prefetch_related('exam_subjects', 'exam_subjects__subject_questions')
    permissions_classes = [IsAuthenticated]

    def list(self, request, pk=None):
        try:
            exam = Exam.objects.get(school__user_id=request.user.id)
            serializer = ExamSerializer(exam)
            return Response(serializer.data)
        except (Exception,):
            return Response({})
    def update(self, request, *args, **kwargs):
        subject_and_score = ''
        try:
            exam = Exam.objects.get(school__user_id=request.user.id)
            if int(kwargs['pk']) != exam.id:
                return Response(status=status.HTTP_403_FORBIDDEN)
        except (Exception,):
            return Response(status=status.HTTP_404_NOT_FOUND)

        if 'csv_file' in request.FILES:
            file = request.FILES['csv_file']
            # patch subjects delete if not in the list
            # Get subjects
            csv = pd.read_csv(file)
            skip_col = 3
            i = 1
            total_questions = []
            list_of_subjects = []
            for col in csv.columns:
                if i > skip_col and col != 'Overall':
                    subject_and_score += (str(col)+',')
                    a = col.split('/')
                    list_of_subjects.append(a[0])
                    total_questions.append(a[1])
                    # list_of_subjects.append(col.lower())
                i += 1
            # current subjects
            subjects = Subject.objects.filter(exam=exam)
            # get current subject for check
            current_subjects = []
            current_total_questions = []
            k = 0
            for subject in subjects:
                # if subject.name.lower() not in list_of_subjects:
                if subject.name not in list_of_subjects:
                    Subject.objects.filter(id=subject.id).delete()
                else:
                    # current_subjects.append(subject.name.lower())
                    current_total_questions.append(total_questions[k])
                    current_subjects.append(subject.name)
                k += 1
            j = 0
            for new_subject in list_of_subjects:
                if new_subject not in current_subjects:
                    # Subject.objects.create(exam=exam, name=new_subject.title())
                    Subject.objects.create(exam=exam, name=new_subject,
                                           total_questions=total_questions[j])
                else:
                    s = Subject.objects.get(exam=exam, name=new_subject)
                    if s.total_questions != current_total_questions[j]:
                        s.total_questions = current_total_questions[j]
                        s.save()
                j += 1
            exam.csv_file = request.FILES['csv_file']

            d = subject_and_score[:-1]
            subjects_lists = d.split(',')
            try:
                if exam.spreadsheet_id is None:
                    school = School.objects.get(user=request.user)
                    ss_id = create_spreadsheet(school.name)
                    spreadsheet_top_insert(ss_id, d)
                    spreadsheet_append(ss_id, [
                        ['Student', 'Course', 'Strand'] + subjects_lists + ['Overall']
                    ])
                    exam.spreadsheet_id = ss_id
                    exam.save()
                else:
                    ok = True
                    data = spreadsheet_get_data(exam.spreadsheet_id)[0]
                    if len(data) == len(subjects_lists):
                        for s in subjects_lists:
                            if s not in data:
                                ok = False
                                break
                    else:
                        ok = False
                    if not ok:
                        spreadsheet_delete_row(exam.spreadsheet_id, 0, 1)
                        spreadsheet_top_insert(exam.spreadsheet_id, d)
                        data = [
                            ['---------------------' for i in range(len(subjects_lists)+4)],
                            ['Student', 'Strand', 'Course'] + subjects_lists + ['Overall']
                        ]
                        spreadsheet_append(exam.spreadsheet_id, data)
            except (Exception,):
                pass

        if 'time_limit' in request.data:
            exam.time_limit = request.data['time_limit']

        if 'is_published' in request.data:
            if request.data['is_published'] == "true":
                exam.is_published = True
            else:
                exam.is_published = False

        exam.save()

        '''
        instance = self.get_object()

        evt_serializer = self.serializer_class(
            data=request.data, instance=instance, partial=True)
        evt_serializer.is_valid(raise_exception=True)
        evt_serializer.save()

        return Response(self.serializer_class(self.get_object()).data)
        '''
        return Response(status=status.HTTP_200_OK)


class QuestionListCreate(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    '''
    def get_queryset(self):
        search = self.request.query_params.get('search')
        if search is not None:
            queryset = queryset.filter(text__contains=search)
        return queryset
    '''

    def list(self, request, *args, **kwargs):
        queryset = Question.objects.filter(subject_id=self.kwargs['pk']).prefetch_related('question_choices')
        questions = self.get_serializer(queryset, many=True).data
        try:
            exam = Exam.objects.get(school__user_id=request.user.id)
            subject = Subject.objects.get(pk=kwargs['pk'], exam=exam)
        except Subject.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = dict()
        data['subject'] = subject.name
        data['total_question'] = subject.total_questions
        data['is_published'] = exam.is_published
        data['current_score'] = subject.current_score
        data['questions'] = questions
        return Response({ 'subject_questions': data }, status=status.HTTP_200_OK)


    #def perform_create(self, serializer):
        #serializer.save(subject_id=self.kwargs['pk'])

class QuestionUpdateDestroy(generics.CreateAPIView,
                            generics.DestroyAPIView,
                            generics.UpdateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Question.objects.filter(id=self.kwargs['pk'])

    def create(self, request, *args, **kwargs):
        if 'checked' in request.data:
            if len(request.data) >= 1:
                subject_id = -1
                cnt = 0
                for i in request.data['checked']:
                    question = Question.objects.get(pk=i)
                    subject_id = question.subject_id
                    choices = Choice.objects.filter(question=question)
                    if question.type == 2:
                        cnt += len(choices[0].correct.split(','))*question.score
                    elif question.type == 3:
                        pass
                        # cnt += choices.count()
                    else:
                        for j in choices:
                            if j.correct == 'true':
                                cnt += question.score
                    question.delete()
                if subject_id != -1:
                    subject = Subject.objects.get(pk=subject_id)
                    subject.current_score = subject.current_score - cnt
                    subject.save()
            else:
                return Response({'error': '1'} ,status=status.HTTP_200_OK)
        else:
            return Response({'error': '1'} ,status=status.HTTP_200_OK)

        return Response(status=status.HTTP_200_OK)

'''
class QuestionUpdateDestroy(generics.DestroyAPIView,
                            generics.RetrieveAPIView,
                         generics.UpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Question.objects.filter(id=self.kwargs['pk'])

class SubjectQuestionViewSet(ModelViewSet):
    serializer_class = SubjectQuestionSerializer
    queryset = Subject.objects.prefetch_related('subject_questions')
    permissions_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Subject.objects.filter(exam__school__user_id=user.id)
'''

class SchoolExamRetrieve(generics.RetrieveAPIView,):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, *args, **kwargs):
        try:
            result = Result.objects.get(student__user_id=self.request.user.id, school_id=kwargs['pk'])
            if result.submitted:
                return Response({'taken': '1'}, status=status.HTTP_200_OK)
        except Result.DoesNotExist:
            pass
        try:
            school_obj = School.objects.get(pk=kwargs['pk'])
            serializer = self.get_serializer(school_obj, many=False).data
        except School.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        # check status
        status_ = None
        try:
            s = StudentApplied.objects.get(school_id=kwargs['pk'], student__user_id=self.request.user.id)
            status_ = s.status
        except StudentApplied.DoesNotExist:
            status_ = None

        exam_obj = Exam.objects.get(school=school_obj)
        subjects_obj = Subject.objects.filter(exam=exam_obj)
        data = dict()
        data = serializer
        data['status'] = status_
        subjects = []
        for subject in subjects_obj:
            s = {
                'name': subject.name,
                'question_count': subject.total_questions
            }
            subjects.append(s)
        data['subjects'] = subjects

        return Response(data, status=status.HTTP_200_OK)


class StudentExamResults(generics.ListAPIView,
                        generics.RetrieveAPIView):
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['student__user__name', 'student__strand', 'student__school']

    def get_queryset(self):
        date_from = self.request.query_params.get('from')
        date_to = self.request.query_params.get('to')
        if date_from is not None and date_to is not None:
            return Result.objects.filter(school__user_id=self.request.user.id,
                                         submitted=True,
                                         date_taken__range=[date_from + ' 00:00', date_to + ' 23:59'])

        return Result.objects.filter(school__user_id=self.request.user.id, submitted=True)

    def get_object(self):
        obj = Result.objects.get(pk=self.kwargs['pk'],
                                         submitted=True)
        return obj

    def retrieve(request, *args, **kwargs):
        return Response({ 'test': 'fds'})
# get
class StudentExamResult(generics.RetrieveAPIView, generics.DestroyAPIView):
    serializer_class = ResultSingleSerializer

    def destroy(self, request, *args, **kwargs):
        error = 0
        if 'student_id' in request.data:
            student_id = request.data['student_id']
            try:
                result = Result.objects.get(school__user=self.request.user, student_id=student_id)
                result.delete()
            except Result.DoesNotExist:
                error += 1
            try:
                student_applied = StudentApplied.objects.get(school__user=self.request.user, student_id=student_id)
                student_applied.delete()
            except StudentApplied.DoesNotExist:
                error += 1

            try:
                exam = Exam.objects.get(school__user=request.user)
                if exam.spreadsheet_id is not None:
                    data = spreadsheet_get_data(exam.spreadsheet_id)
                    df = pd.DataFrame(data)
                    indexes = df.index[df[df.columns[0]] == str(student_id)].tolist()
                    if len(indexes) > 0:
                        spreadsheet_delete_row(exam.spreadsheet_id, indexes[0], indexes[len(indexes)-1]+1)
            except (Exception,):
                pass


        if error == 2:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)

    def get_object(self):
        try:
            obj = Result.objects.get(pk=self.kwargs['pk'], submitted=True, school__user_id=self.request.user.id)
        except Result.DoesNotExist:
            raise Http404
        return obj


class CsvData(APIView):
    def get(self, request, format=None, *args, **kwargs):

        data={}
        csv_file = Exam.objects.get(school__user_id=request.user.id).csv_file
        csv = pd.read_csv(csv_file, na_filter=False)
        total = csv[csv.columns[0]].count()

        page_count = 15
        page = kwargs['page']
        start = (page - 1) * page_count + 1
        end = 0
        if page_count < total:
            end = page_count * page
            if end > total:
                end = total
        csv = csv.iloc[start-1:end]
        t = []
        for index, row in csv.iterrows():
            t.append(row)
        data['data'] = t
        csv.drop_duplicates(subset ="Strand",
                            keep = 'first', inplace = True)
        data['strands'] = csv['Strand'].values
        #subjects = []
        row_header = []
        skip_col = 2
        i = 0
        for col in csv.columns:
            if i >= skip_col:
                row_header.append(col.split('/')[0])
            else:
                row_header.append(col)
            i += 1
        #data['subjects'] = subjects
        data['row_header'] = row_header
        data['count'] = total
        try:
            pass
        except (Exception,):
            return Response({ 'status': '204' }, status=status.HTTP_200_OK)

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, format=None, **kwargs):
        pass
        '''
        try:
            d = request.data
            strand = d['strand']
            fields = d['fields']
            csv_file = Exam.objects.get(school__user_id=request.user.id).csv_file
            data = pd.read_csv(csv_file)

            predictors = []
            try:
                skip_col = 2
                j = 0
                for col in data.columns:
                    if j >= skip_col:
                        predictors.append(int(fields[col]))
                    j += 1
            except (Exception,):
                return Response({ 'status': '-1' }, status=status.HTTP_200_OK)
            dummies = pd.get_dummies(data['Strand'])
            for s in dummies.columns.values:
                if s == strand:
                    predictors.append(1)
                else:
                    predictors.append(0)
            merged = pd.concat([data, dummies], axis='columns')
            merged = merged.drop(['Course', 'Strand'], axis='columns')

            c = data['Course'].values
            course = [i for i in c]
            y = [i for i in range(len(c))]
            drop = [-1]

            recommended = []
            for i in range(10):
                if len(y) <= 0:
                    break
                
                if drop[0] != -1:
                    merged = merged.drop(drop, axis='rows').reset_index(drop=True)
                    course.pop(drop[0])
                    
                x = merged.values
                model = LinearRegression()
                model.fit(x, y)
                r2 = (model.score(x, y))
                p = model.predict([predictors])
               
                y.pop()
                predicted = round(p[0])
                if predicted >= len(y)-1:
                    drop[0] = len(y)-1
                elif predicted <= 0:
                    drop[0] = 0
                else:
                    drop[0] = predicted
                recommended.append({ 'course': course[drop[0]], 'score': r2 })

            recommended = sorted(recommended, key=lambda d: d['score'], reverse=True)
        except (Exception,):
            return Response({ 'status': '204' }, status=status.HTTP_200_OK)

        return Response(recommended, status=status.HTTP_200_OK)
        '''


class StudentAppliedList(generics.ListAPIView, generics.UpdateAPIView):
    serializer_class = AppliedStudentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['student__user__name']

    def get_queryset(self):
        s = 'Pending'
        status_ = self.request.query_params.get('status')
        if status_ is not None:
            s = status_
        # applied = StudentApplied.objects.filter(school_id=self.request.user.id).values_list('student_id')
        return StudentApplied.objects.filter(school__user_id=self.request.user.id, status=s).select_related('student', 'school')

    def update(self, request, *args, **kwargs):
        data = request.data
        if 'student_ids' in request.data and 'accept' in request.data:
            if len(data['student_ids']) >= 1:
                for i in data['student_ids']:
                    s = StudentApplied.objects.get(student_id=i, school__user_id=self.request.user.id)
                    s.status = 'Accepted'
                    s.datetime_modified = timezone.now()
                    s.save()
        elif 'student_ids' in request.data and 'reject' in request.data:
            if len(data['student_ids']) >= 1:
                for i in data['student_ids']:
                    s = StudentApplied.objects.get(student_id=i, school__user_id=self.request.user.id)
                    s.status = 'Rejected'
                    s.datetime_modified = timezone.now()
                    s.save()
        elif 'student_ids' in request.data and 'pending' in request.data:
            if len(data['student_ids']) >= 1:
                for i in data['student_ids']:
                    s = StudentApplied.objects.get(student_id=i, school__user_id=self.request.user.id)
                    s.status = 'Pending'
                    s.datetime_modified = timezone.now()
                    s.save()
        else:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return Response(status=status.HTTP_200_OK)

#Notification
class Notification(APIView):
    def get(self, request, format=None, **kwargs):
        s = StudentApplied.objects.filter(school__user_id=self.request.user.id).select_related('student', 'student__user')
        data = dict()
        data['not_seen_count'] = s.filter(is_seen_by_school=False).count()
        data['count'] = s.count()
        return Response(data, status=status.HTTP_200_OK)

class NotificationDetailsPagination(PageNumberPagination):
    page_size = 3
    def get_paginated_response(self, data):
        return Response(data)

class NotificationDetails(generics.ListAPIView, generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    pagination_class = NotificationDetailsPagination

    def get_queryset(self):
        return StudentApplied.objects.filter(school__user_id=self.request.user.id).select_related('student', 'student__user')

    def update(self, request, *args, **kwargs):
        data = request.data
        if 'read_all' in data:
            s = StudentApplied.objects.filter(school__user_id=self.request.user.id,
                                              is_seen_by_school=False).select_related('student', 'student__user')
            s.update(is_seen_by_school=True)
        if 'id' in data:
            try:
                s = StudentApplied.objects.get(id=data['id'], school__user_id=self.request.user.id)
                s.is_seen_by_school = True
                s.save()
            except StudentApplied.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)

#Notification end


# Dashboard

class DashboardDetails(generics.ListAPIView):

    def list(self, request):
        data = dict()
        today = datetime.datetime.now()
        current_year = Result.objects.filter(school__user=request.user, date_taken__year=today.year)\
            .annotate(month=ExtractMonth('date_taken')) \
            .values('month').annotate(c=Count('id')).order_by()
        previous_year = Result.objects.filter(school__user=request.user, date_taken__year=today.year-1) \
            .annotate(month=ExtractMonth('date_taken'))\
            .values('month').annotate(c=Count('id')).order_by()
        data['current_year'] = current_year
        data['previous_year'] = previous_year


        result = Result.objects.filter(school__user=request.user, submitted=True)
        course = CourseRecommended.objects.filter(result__in=result).values('course').annotate(c=Count('course')).order_by('-c')
        data['course_rank'] = list(course)

        return Response(data, status=status.HTTP_200_OK)

# Dashboard end


class ImportQuestion(APIView):
    def post(self, request, *args, **kwargs):
        subject_id = kwargs.get('pk', '')
        if subject_id != '':
            subject = Subject.objects.get(id=subject_id)
            score_cnt = 0
            score_cnt += subject.current_score
            if request.data['delete']:
                Question.objects.filter(subject_id=subject_id).delete()
                score_cnt -= subject.current_score
            data = request.data['data']
            for d in data:
                score = int(d['points'])
                q_type = -1
                if d['type'] == 'Multiple':
                    q_type = 0
                elif d['type'] == 'Checkbox' :
                    q_type = 1
                elif d['type'] == 'Fillintheblank' :
                    q_type = 2

                question = Question.objects.create(
                    text=d['question'],
                    type=q_type,
                    score=score,
                    subject_id=subject_id
                )

                answer = d['answer'].split(',')
                answer = [x.strip() for x in answer]
                score_cnt += (score*len(answer))
                if q_type == 0 or q_type == 1:
                    for i in range(5):
                        cur_index = 'c'+str(i+1)
                        if d[cur_index] == '':
                            break
                        else:
                            correct = 'false'
                            if 'Choice'+str(i+1) in answer:
                                correct='true'
                            Choice.objects.create(
                                correct=correct,
                                text=d[cur_index],
                                question=question
                            )
                elif q_type == 2:
                    Choice.objects.create(
                        correct=','.join(answer),
                        question=question
                    )
            subject.current_score = score_cnt
            subject.save()

        return Response(status=status.HTTP_200_OK)


class ExportCSV(APIView):
    def get(self, request, format=None):
        exam = Exam.objects.get(school__user=request.user)
        d = spreadsheet_get_data(exam.spreadsheet_id)
        df = pd.DataFrame(d)
        df = df.iloc[1:]
        file_path = os.path.join(settings.BASE_DIR, 'files/'+exam.spreadsheet_id+'.csv')
        df.to_csv(file_path, index=False, header=False)
        data = dict()
        data['spreadsheetId'] = exam.spreadsheet_id

        return Response(data, status=status.HTTP_200_OK)

class ExportResult(APIView):
    def put(self, request, format=None):
        data = request.data
        # if filtered
        '''
        Parent.objects.annotate(
            nabc=Count('children', filter=~Q(children__foo='ABC'))
        ).filter(
            nabc=0
        )
        '''
        results = None
        if data is not None:
            results = Result.objects.filter(school__user=request.user,
                                            submitted=True,
                                            date_taken__range=[data['from'] + ' 00:00', data['to'] + ' 23:59'])
        else:
            results = Result.objects.filter(school__user=request.user, submitted=True)

        result_list = []
        for r in results:
            obj = {
                'STUDENT ID': '',
                'NAME': '',
                'DATE': '',
                'SCHOOL': '',
                'STRAND': '',
                #'ENGLISH': '',
                #'MATH': '',
                #'SCIENCE': '',
                #'OVERALL': '',
                #'COURSE RECOMMENDED': '',
            }
            course_recommended_list = ''
            overall = 0
            obj['STUDENT ID'] = r.student.id
            obj['NAME'] = r.student.user.name
            obj['DATE'] = str(r.date_taken).split(' ')[0]
            obj['SCHOOL'] = r.student.school
            obj['STRAND'] = r.student.strand
            result_details = ResultDetails.objects.filter(result=r)
            courses_r = CourseRecommended.objects.filter(result=r, rank=1)
            for rd in result_details:
                obj[rd.subject.upper()+'/'+str(rd.overall)] = rd.score
                overall += rd.score
            for c in courses_r:
                course_recommended_list += c.course + ', '

            obj['OVERALL'] = overall
            if course_recommended_list != '':
                obj['COURSE RECOMMENDED'] = course_recommended_list[:-2]
            else:
                obj['COURSE RECOMMENDED'] = ''

            result_list.append(obj)

        df = pd.DataFrame(result_list)
        file_path = os.path.join(settings.BASE_DIR, 'files/results-'+str(request.user.id)+'.csv')
        df.to_csv(file_path, index=False, header=True)

        return Response({ 'file_name': 'results-'+str(request.user.id)+'.csv' }, status=status.HTTP_200_OK)
