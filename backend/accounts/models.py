from time import timezone

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from cloudinary.models import CloudinaryField
import cloudinary.uploader
from django.dispatch import receiver
from rest_framework.fields import empty


class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, name=name)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, password):
        user = self.create_user(email, name, password)

        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    USER_TYPE = (
        (0, 'ADMIN'),
        (1, 'SCHOOLADMIN'),
        (2, 'STUDENT'),
    )

    email = models.EmailField(max_length=255, unique=True, null=False, blank=False)
    name = models.CharField(max_length=255)
    type = models.IntegerField(choices=USER_TYPE, default=0, verbose_name='User Type')
    activated = models.CharField(max_length=255, default='0')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']


class School(models.Model):
    user = models.OneToOneField(
        User, related_name="school_user", on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=True, blank=True)
    logo = CloudinaryField('image', blank=True, null=True,
                           folder="logo/",
                           transformation={"quality": 50},
                        )
    description = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return '{} / {}'.format(self.user.name ,self.name)

@receiver(models.signals.post_delete, sender=School)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    When User is deleted remove Image
    """
    if instance.logo:
        cloudinary.uploader.destroy(instance.logo.public_id, invalidate=True)

@receiver(models.signals.pre_save, sender=School)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    When user is updated remove old image update with new 
    """
    if not instance.pk:
        return False

    try:
        old_file = School.objects.get(pk=instance.pk).logo
        if not old_file:
            return False
    except School.DoesNotExist:
        return False

    if str(instance.logo) != str(old_file):
        cloudinary.uploader.destroy(old_file.public_id, invalidate=True)

class Student(models.Model):
    '''
    GENDER_ = (
        (0, 'Male'),
        (1, 'Female'),
    )
    STRAND_ = (
        (0, 'STEM'),
        (1, 'ABM'),
        (2, 'HUMSS'),
        (3, 'GAS'),
        (4, 'ICT'),
    )
    '''
    user = models.OneToOneField(
        User, related_name="student_user", on_delete=models.CASCADE)
    # gender = models.IntegerField(choices=GENDER_, default=0)
    school = models.CharField(max_length=255)
    age = models.IntegerField(null=True, default=0)
    # strand = models.IntegerField(choices=STRAND_, default=0)
    gender = models.CharField(max_length=10, default='Male', null=True)
    strand = models.CharField(max_length=50, default='', null=True)
    birth_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.user.name

class StudentApplied(models.Model):
    school = models.ForeignKey(
        School, related_name="applied_school", on_delete=models.CASCADE)
    student = models.ForeignKey(
        Student, related_name="student_applied", on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='none', null=True, blank=True)
    is_seen_by_student = models.BooleanField(default=False)
    is_seen_by_school = models.BooleanField(default=False)
    datetime_created = models.DateTimeField(auto_now_add=True)
    datetime_modified = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return '{}/{}'.format(self.school.name, self.student.user.name)

