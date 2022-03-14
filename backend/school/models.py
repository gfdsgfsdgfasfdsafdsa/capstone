from django.db import models
from accounts.models import School, User, Student
from cloudinary.models import CloudinaryField
from django.dispatch import receiver
import os
import time
import cloudinary.uploader

class Exam(models.Model):
    def path(self, filename):
        file_type = filename.split(".")[-1]
        f = str(round(time.time() * 1000)) + '_' + str(self.school.name) + '_' + '.' + file_type
        return '/'.join(['csv/', f])
    
    school = models.OneToOneField(
        School, related_name="school_exam", on_delete=models.CASCADE)
    csv_file = models.FileField(upload_to=path, blank=True, null=True)
    time_limit = models.CharField(max_length=10, default="00:00")
    is_published = models.BooleanField(default=False)
    
    def __str__(self):
        n = self.school.name
        if n:
            return n
        else:
            return ''

@receiver(models.signals.post_save, sender=User)
def auto_create_school_model(sender, instance, created, **kwargs):
    if created and instance.type == 1:
        school = School.objects.create(user=instance)
        Exam.objects.create(school=school)

@receiver(models.signals.post_delete, sender=Exam)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    # on delete run
    if instance.csv_file:
        if os.path.isfile(instance.csv_file.path):
            os.remove(instance.csv_file.path)
        

@receiver(models.signals.pre_save, sender=Exam)
def auto_delete_file_on_change(sender, instance, **kwargs):
    # on update_run
    if not instance.pk:
        return False

    try:
        old_file = Exam.objects.get(pk=instance.pk).csv_file
        if not old_file:
            return False
    except Exam.DoesNotExist:
        return False

    new_file = instance.csv_file
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)

class Subject(models.Model):
    exam = models.ForeignKey(
        Exam, related_name="exam_subjects", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    total_questions = models.IntegerField(default=0, null=True, blank=True)

    def __str__(self):
        return self.name

class Question(models.Model):
    Question_Type = (
        (0, 'multipleChoice'),
        (1, 'checkbox'),
        (2, 'fillInTheBlank'),
        (4, 'trueOrFalse'),
    )
    subject = models.ForeignKey(
        Subject, related_name="subject_questions", on_delete=models.CASCADE)
    text = models.TextField(max_length=500)
    type = models.IntegerField(choices=Question_Type, default=0)
    image = CloudinaryField('image', blank=True, null=True,
                           folder="question/",
                           transformation={"quality": 50},
                           )
    score = models.IntegerField()

    def __str__(self):
        return self.text

    @property
    def choices(self):
        return self.question_choices.all()

@receiver(models.signals.post_delete, sender=Question)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    When User is deleted remove Image
    """
    if instance.image:
        cloudinary.uploader.destroy(instance.image.public_id, invalidate=True)

@receiver(models.signals.pre_save, sender=Question)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    When user is updated remove old image update with new
    """
    if not instance.pk:
        return False

    try:
        old_file = Question.objects.get(pk=instance.pk).image
        if not old_file:
            return False
    except Question.DoesNotExist:
        return False

    if str(instance.image) != str(old_file):
        cloudinary.uploader.destroy(old_file.public_id, invalidate=True)

class Choice(models.Model):
    question = models.ForeignKey(
        Question, related_name="question_choices", on_delete=models.CASCADE)
    text = models.TextField(max_length=500, blank=True, null=True)
    correct = models.TextField(max_length=500)
    image = CloudinaryField('image', blank=True, null=True,
                            folder="choices/",
                            transformation={"quality": 50},
                            )

@receiver(models.signals.post_delete, sender=Choice)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    When User is deleted remove Image
    """
    if instance.image:
        cloudinary.uploader.destroy(instance.image.public_id, invalidate=True)

@receiver(models.signals.pre_save, sender=Choice)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    When user is updated remove old image update with new
    """
    if not instance.pk:
        return False

    try:
        old_file = Choice.objects.get(pk=instance.pk).image
        if not old_file:
            return False
    except Choice.DoesNotExist:
        return False

    if str(instance.image) != str(old_file):
        cloudinary.uploader.destroy(old_file.public_id, invalidate=True)






    
