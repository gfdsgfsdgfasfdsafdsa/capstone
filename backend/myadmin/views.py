from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework import filters

from .serializers import SchoolSerializer, School, User, StudentSerializer, Student
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.type == 0

class SchoolListCreateAPI(generics.ListAPIView, generics.CreateAPIView):
    serializer_class = SchoolSerializer
    queryset = School.objects.all().select_related('user')
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    '''
    def create(self, request, *args, **kwargs):
        data = request.data
        email = data.pop('email')
        password = data.pop('password')
        print(data)

        return Response(status=status.HTTP_200_OK)
        if User.objects.filter(email=email).exists():
            return Response({ 'email_exist': 1 } ,status=status.HTTP_204_NO_CONTENT)

        if 'logo' in data:
            if data['logo'] == 'null' or data['logo'] is None:
                data['logo'] = None

        user = User.objects.create(email=email, type=1, activated=1, name='')
        user.set_password(password)
        user.save()
        try:
            School.objects.create(**data, user=user)
        except IntegrityError:
            School.objects.filter(user=user).delete()
            School.objects.create(**data, user=user)

        return Response(status=status.HTTP_200_OK)
    '''


class SchoolUpdateDestroyAPI(generics.UpdateAPIView, generics.DestroyAPIView, generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = SchoolSerializer
    queryset = School.objects.all().select_related('user')

    def update(self, request, *args, **kwargs):
        try:
            school = School.objects.get(id=kwargs['pk'])
        except School.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if 'logo' in data:
            school.logo = data['logo']
            school.save()
        elif 'name' in data:
            user = User.objects.get(id=school.user.id)

            current = User.objects.filter(email=data['email'])
            if current.exists():
                for i in current:
                    if i.email != user.email:
                        return Response({ 'email_exist': '1' } ,status=status.HTTP_200_OK)

            user.email = data['email']
            school.name = data['name']
            school.description = data['description']

            school.save()
            user.save()
        elif 'password' in data:
            user_id = School.objects.get(id=kwargs['pk']).user.id
            user = User.objects.get(id=user_id)
            user.set_password(data['password'])
            user.save()

        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            user_id = School.objects.get(id=kwargs['pk']).user.id
            User.objects.filter(id=user_id).delete()

        return Response(status=status.HTTP_200_OK)

class StudentAPI(generics.ListAPIView, generics.UpdateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__name', 'user__email']

    def get_queryset(self):
        activated = self.request.query_params.get('activated')
        if activated == 'yes':
            return Student.objects.filter(user__activated=1).select_related('user')
        else:
            return Student.objects.filter(~Q(user__activated=1)).select_related('user')

    def update(self, request, *args, **kwargs):
        data = request.data
        if 'student_ids' in request.data and 'activate' in request.data:
            if len(data['student_ids']) >= 1:
                for i in data['student_ids']:
                    s = User.objects.get(id=i)
                    s.activated = 1
                    s.save()
        elif 'student_ids' in request.data and 'deactivate' in request.data:
            if len(data['student_ids']) >= 1:
                for i in data['student_ids']:
                    s = User.objects.get(id=i)
                    s.activated = 0
                    s.save()
        else:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return Response(status=status.HTTP_200_OK)


# Dashboard Details
class DashboardDetails(generics.ListAPIView):

    def list(self, request):
        data = dict()
        school = School.objects.annotate(count=Count('school_result')).values('name', 'count').order_by()
        data['school'] = list(school)

        return Response(data, status=status.HTTP_200_OK)


