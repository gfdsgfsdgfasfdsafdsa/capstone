import json
from rest_framework import serializers
from .models import Exam, Subject, Question, Choice
from accounts.models import School, Student, StudentApplied, User
from student.models import Result, ResultDetails, CourseRecommended

class ChoiceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    image = serializers.SerializerMethodField('_image')

    class Meta:
        model = Choice
        fields = ['id', 'text', 'image', 'correct']

    def _image(self, obj):
        try:
            return obj.image.url
        except AttributeError:
            return None


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, required=False)
    images = serializers.ListField(write_only=True)
    choices_list = serializers.ListField(write_only=True)
    image = serializers.SerializerMethodField('_image')

    class Meta:
        model = Question
        fields = ['id', 'image', 'text', 'type', 'score', 'choices', 'images', 'choices_list']


    def _image(self, obj):
        try:
            return obj.image.url
        except AttributeError:
            return None

    def create(self, validated_data):
        question = validated_data.copy()
        subject = Subject.objects.get(pk=self.context.get('view').kwargs.get('pk'))

        images = question.pop('images')
        choices = question.pop('choices_list')

        ordered_images = [None] * len(images)
        for image in images:
            if image != 'null':
                ordered_images[int(image.name)] = image

        question['image'] = ordered_images[0]
        # choices = question.pop('choices')
        question = Question.objects.create(**question, subject=subject)

        i = 1
        for choice in choices:
            choice = json.loads(choice)
            choice['image'] = ordered_images[i]
            Choice.objects.create(**choice, question=question)
            i += 1
        return question

    def update(self, instance, validated_data):
        # choices = validated_data.pop('choices')
        images = validated_data.pop('images')
        choices = validated_data.pop('choices_list')

        ordered_images = [None] * len(images)
        for image in images:
            if type(image) == str and image[1:] == 'exist':
                print(image[1:])
                ordered_images[int(image[:1])] = 'exist'
                continue
            if image != 'null':
                ordered_images[int(image.name)] = image

        instance.text = validated_data.get('text', instance.text)
        instance.type = validated_data.get('type', instance.type)

        if ordered_images[0] == 'exist':
            pass
        elif ordered_images[0] is None:
            instance.image = None
        else:
            instance.image = ordered_images[0]
        instance.score = validated_data.get('score', instance.score)
        instance.save()
        # existing_ids = [c.id for c in instance.choices]
        keep_choices = []
        i = 1
        for choice in choices:
            choice = json.loads(choice)
            if "id" in choice.keys():
                if Choice.objects.filter(id=choice['id']).exists():
                    c = Choice.objects.get(id=choice['id'])
                    c.text = choice.get('text', c.text)
                    if ordered_images[i] == 'exist':
                        pass
                    elif ordered_images[i] is None:
                        c.image = None
                    else:
                        c.image = ordered_images[i]
                    c.correct = choice.get('correct', c.correct)
                    c.save()
                    keep_choices.append(c.id)
                    i += 1
                else:
                    continue
            else:
                if ordered_images[i] is not None:
                    choice['image'] = ordered_images[i]
                c = Choice.objects.create(**choice, question=instance)
                keep_choices.append(c.id)
                i += 1

        for choice in instance.choices:
            if choice.id not in keep_choices:
                choice.delete()

        return instance

'''
class SubjectQuestionSerializer(serializers.ModelSerializer):
    subject_questions = QuestionSerializer(many=True)

    class Meta:
        model = Subject
        fields = ['id', 'name', 'subject_questions']

    def create(self, validated_data):
        print(validated_data.get('id'))
        #order = Order.objects.get(pk=validated_data.pop('event'))
        #instance = Equipment.objects.create(**validated_data)
        #Assignment.objects.create(Order=order, Equipment=instance)
        return 'test'
'''

class SubjectSerializer(serializers.ModelSerializer):
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ['id', 'name', 'question_count', 'total_questions']

    def get_question_count(self, obj):
        return Question.objects.filter(subject=obj).count()

class ExamSerializer(serializers.ModelSerializer):
    exam_subjects = SubjectSerializer(read_only=True, many=True)

    class Meta:
        model = Exam
        fields = ['id', 'csv_file', 'time_limit', 'is_published', 'exam_subjects']


class SchoolSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = ['id', 'logo_url', 'name', 'description']

    def get_logo_url(self, obj):
        try:
            return obj.logo.url
        except AttributeError:
            return None


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField('get_name')
    email = serializers.SerializerMethodField('get_email')

    class Meta:
        model = Student
        fields = ['id', 'name', 'strand', 'school', 'age', 'gender', 'email']

    def get_name(self, obj):
        return obj.user.name

    def get_email(self, obj):
        return obj.user.email


class AppliedStudentSerializer(serializers.ModelSerializer):
    student = StudentSerializer()

    class Meta:
        model = StudentApplied
        fields = ['status', 'student']

class ResultSerializer(serializers.ModelSerializer):
    student = StudentSerializer()

    class Meta:
        model = Result
        fields = ['id', 'date_taken', 'student']


class StudentDetailSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['gender', 'school', 'age', 'strand', 'name']

    def get_name(self, obj):
        return obj.user.name

class ResultDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultDetails
        fields = ['subject', 'score']

class CourseRecommendedSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseRecommended
        fields = ['id', 'course', 'rank']

class ResultSingleSerializer(serializers.ModelSerializer):
    student = StudentDetailSerializer()
    result_details = ResultDetailSerializer(many=True)
    result_courses = CourseRecommendedSerializer(many=True)

    class Meta:
        model = Result
        fields = ['id', 'date_taken', 'student', 'result_details', 'result_courses']

# Notification View
class NotificationStudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField('_get_name')

    class Meta:
        model = Student
        fields = ['name']

    def _get_name(self, obj):
        return obj.user.name

class NotificationSerializer(serializers.ModelSerializer):
    student = NotificationStudentSerializer()

    class Meta:
        model = StudentApplied
        fields = ['id', 'is_seen_by_school', 'student', 'datetime_created', 'status']

# Notification View end
