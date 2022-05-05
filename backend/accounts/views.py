from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import User, Student, School
from .serializers import UserSerializer
from django.core.mail import send_mail
from rest_framework.permissions import AllowAny
from django.conf import settings
import secrets
'''

class ProfileViewSet(mixins.UpdateModelMixin, 
                     mixins.ListModelMixin,
                     viewsets.GenericViewSet, ):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permissions_classes = [IsAuthenticated, IsOwner]
    
    def list(self, request):
        user = self.get_queryset().get(id=request.user.id)
        serializer = self.serializer_class(user)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)
'''

class ProfileApiView(APIView):
    serializer_class = UserSerializer

    def get(self, request, format=None, **kwargs):
        user = User.objects.get(id=request.user.id)
        serializer = self.serializer_class(user)
        data = dict(serializer.data)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            if user.type == 1:
                s = School.objects.get(user=user)
                data['school'] = s.name
                try:
                    data['logo'] = s.logo.url
                except AttributeError:
                    data['logo'] = None
                data['description'] = s.description
            elif user.type == 2:
                s = Student.objects.get(user=user)
                data['school'] = s.school
                data['gender'] = s.gender
                data['age'] = s.age
                data['strand'] = s.strand
                data['birth_date'] = s.birth_date

        return Response(data , status=status.HTTP_200_OK)

    def post(self, request, format=None):
        # School request
        if 'password' in request.data:
            user = User.objects.get(id=request.user.id)
            user.set_password(request.data['password'])
            user.save()
        elif request.user.type == 2:
            user = User.objects.get(id=request.user.id)
            user.name = request.data['name']
            s = Student.objects.get(user=user)
            s.school = request.data['school']
            s.age = request.data['age']
            s.birth_date = request.data['birth_date']
            s.gender = request.data['gender']
            s.strand = request.data['strand']
            s.save()
            user.save()
        elif request.user.type == 1:
            if 'details' in request.data:
                s = School.objects.get(user_id=request.user.id)
                s.name = request.data['name']
                s.description = request.data['description']
                s.save()
            elif 'logo' in request.data:
                s = School.objects.get(user_id=request.user.id)
                s.logo = request.data['logo']
                s.save()

        return Response(status=status.HTTP_200_OK)


class StudentRegistration(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        data = request.data
        email_exist = True
        try:
            User.objects.get(email=data['email'])
        except User.DoesNotExist:
            email_exist = False
        if email_exist:
            return Response({ 'email_exist': '1' }, status=status.HTTP_200_OK)

        activation_token = secrets.token_urlsafe()
        while True:
            if User.objects.filter(activated=activation_token).count() == 0:
                break
            else:
                activation_token = secrets.token_urlsafe()

        message = '{}\n{}'.format('Click the click to activate your account',
                                  settings.FRONT_END_URL+'/activate-account?token='+activation_token)
        send_mail(
            'Account Activation',
            message,
            settings.EMAIL_HOST_USER,
            [data['email']],
            fail_silently=False,
        )

        user = User.objects.create(
            email=data['email'],
            name=data['name'],
            type=2,
            activated=1,
            #activated=activation_token,
        )
        user.set_password(request.data['password'])
        user.save()
        Student.objects.create(
            user=user,
            gender=data['gender'],
            school=data['school'],
            age=data['age'],
            strand=data['strand'],
            birth_date=data['birth_date']
        )

        return Response({ 'registered': '1' }, status=status.HTTP_200_OK)


class ActivateAccount(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        if 'token' in request.data:
            try:
                user = User.objects.get(activated=request.data['token'])
                user.activated = '1'
                user.save()
            except User.DoesNotExist:
                return Response({ 'broken': '1' }, status=status.HTTP_200_OK)


        return Response({ 'activated': '1' }, status=status.HTTP_200_OK)










