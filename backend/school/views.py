from datetime import datetime
from django.utils import timezone

from django.db.models import Count, Sum, Prefetch
from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import filters

from .serializers import ExamSerializer, Exam, Subject, Question, QuestionSerializer, School, SchoolSerializer, Result, \
    ResultSerializer, ResultSingleSerializer, StudentSerializer, StudentApplied, Student, AppliedStudentSerializer, \
    NotificationSerializer, Choice
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
                        cnt += len(choices[0].correct.split(','))
                    else:
                        for j in choices:
                            if j.correct == 'true':
                                cnt += 1
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
                'question_count': subject.subject_questions.count()
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
        return Result.objects.filter(school__user_id=self.request.user.id, submitted=True)

    def get_object(self):
        obj = Result.objects.get(pk=self.kwargs['pk'],
                                         submitted=True)
        return obj

    def retrieve(request, *args, **kwargs):
        return Response({ 'test': 'fds'})
# get
class StudentExamResult(generics.RetrieveAPIView):
    serializer_class = ResultSingleSerializer

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
        csv = pd.read_csv(csv_file)
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



