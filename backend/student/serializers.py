from rest_framework import serializers
from school.models import Exam, Subject, Question, Choice
from accounts.models import School, StudentApplied, Student
from .models import Result, ResultDetails

# School List Serializer
class StudentAppliedSerializer(serializers.ModelSerializer):
    student_status = serializers.ReadOnlyField()

    class Meta:
        model = StudentApplied
        fields = ['student_status']

class SchoolListSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField('_logo_url')
    status = serializers.SerializerMethodField('_status')

    class Meta:
        model = School
        fields = ['id', 'logo_url', 'name', 'status']

    def _logo_url(self, obj):
        try:
            return obj.logo.url
        except AttributeError:
            return None

    def _status(self, obj):
        user = self.context['request'].user
        if user.type == 2:
            try:
                return obj.applied_school.get(student__user_id=user.id).status
            except StudentApplied.DoesNotExist:
                return None
        return None
# End

# Exam Questions Serializer
class ChoiceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    image = serializers.SerializerMethodField('_image')

    class Meta:
        model = Choice
        fields = ['id', 'text', 'image']

    def _image(self, obj):
        try:
            return obj.image.url
        except AttributeError:
            return None

    # def get_answer(self, obj):
        # return False

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)
    cb_limit = serializers.SerializerMethodField('checkbox_limit')
    image = serializers.SerializerMethodField('_image')

    class Meta:
        model = Question
        fields = ['id', 'text', 'image', 'type', 'score', 'cb_limit','choices']


    def _image(self, obj):
        try:
            return obj.image.url
        except AttributeError:
            return None

    def checkbox_limit(self, obj):
        cnt = 0
        if obj.type == 1:
            for c in Choice.objects.filter(question_id=obj.id):
                if c.correct == 'true':
                    cnt += 1
        return cnt

class SubjectSerializer(serializers.ModelSerializer):
    subject_questions = QuestionSerializer(many=True)

    class Meta:
        model = Subject
        fields = ['id', 'name', 'subject_questions']


class ExamSerializer(serializers.ModelSerializer):
    exam_subjects = SubjectSerializer(read_only=True, many=True)

    class Meta:
        model = Exam
        fields = ['id', 'csv_file', 'time_limit', 'is_published', 'exam_subjects']

class SchoolSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    school_exam = ExamSerializer()

    class Meta:
        model = School
        fields = ['id', 'logo_url', 'name', 'description', 'school_exam']

    def get_logo_url(self, obj):
        try:
            return obj.logo.url
        except AttributeError:
            return None


class ResultsSerializer(serializers.ModelSerializer):
    school_name = serializers.SerializerMethodField()
    school_description = serializers.SerializerMethodField()
    school_logo = serializers.SerializerMethodField()
    school_id = serializers.SerializerMethodField()

    class Meta:
        model = Result
        fields = ['id', 'date_taken' ,'school_name', 'school_description', 'school_logo', 'school_id']

    def get_school_id(self, obj):
        return obj.school.id

    def get_school_name(self, obj):
        return obj.school.name

    def get_school_description(self, obj):
        return obj.school.name

    def get_school_logo(self, obj):
        try:
            return obj.school.logo.url
        except AttributeError:
            return None


# Notification View
class NotificationSchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['name']

class NotificationSerializer(serializers.ModelSerializer):
    school = NotificationSchoolSerializer()

    class Meta:
        model = StudentApplied
        fields = ['id', 'is_seen_by_student', 'school', 'datetime_modified', 'status']

# Notification View end




