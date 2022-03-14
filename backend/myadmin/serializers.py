from django.db import IntegrityError

from accounts.models import School, User, Student
from rest_framework import serializers

class SchoolSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField('_logo_url')
    email = serializers.SerializerMethodField('_email')
    logo = serializers.ListField(write_only=True)
    school_email = serializers.EmailField(write_only=True)
    password = serializers.CharField(max_length=255, write_only=True)

    class Meta:
        model = School
        fields = ['id', 'logo_url', 'name', 'email', 'description', 'logo', 'school_email', 'password']

    def _logo_url(self, obj):
        try:
            return obj.logo.url
        except AttributeError:
            return None

    def _email(self, obj):
        return obj.user.email

    def create(self, validated_data):
        data = validated_data
        email = data.pop('school_email')
        password = data.pop('password')

        if User.objects.filter(email=email).exists():
            res = serializers.ValidationError({"email_exist": "1"})
            res.status_code = 200
            raise res

        if 'logo' in data:
            if data['logo'][0] == 'null' or data['logo'][0] is None:
                data.pop('logo')
            else:
                data['logo'] = data['logo'][0]

        user = User.objects.create(email=email, type=1, activated=1, name='')
        user.set_password(password)
        user.save()
        try:
            school = School.objects.create(**data, user=user)
        except IntegrityError:
            School.objects.filter(user=user).delete()
            school = School.objects.create(**data, user=user)
        return school


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField('_get_name')
    email = serializers.SerializerMethodField('_get_email')
    activated = serializers.SerializerMethodField('_get_activated')
    user_id = serializers.SerializerMethodField('_get_user_id')

    class Meta:
        model = Student
        fields = ['user_id', 'name', 'strand', 'school', 'age', 'gender', 'email', 'activated']

    def _get_name(self, obj):
        return obj.user.name

    def _get_user_id(self, obj):
        return obj.user.id

    def _get_email(self, obj):
        return obj.user.email

    def _get_activated(self, obj):
        return obj.user.activated



