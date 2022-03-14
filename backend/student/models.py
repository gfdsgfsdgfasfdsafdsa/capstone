from django.db import models
from accounts.models import Student, School

class Result(models.Model):
    student = models.ForeignKey(
        Student, related_name="student_results", on_delete=models.CASCADE)
    school = models.ForeignKey(
        School, related_name="school_result", on_delete=models.CASCADE)
    submitted = models.BooleanField(default=False)
    date_taken = models.DateTimeField(null=True, blank=True)
    date_end = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Exam Result'
        ordering = ['-id']

class ResultDetails(models.Model):
    result = models.ForeignKey(
        Result, related_name="result_details", on_delete=models.CASCADE)
    score = models.IntegerField()
    subject = models.CharField(max_length=255)

    class Meta:
        verbose_name = 'Result Detail'


class CourseRecommended(models.Model):
    result = models.ForeignKey(
        Result, related_name="result_courses", on_delete=models.CASCADE)
    course = models.CharField(max_length=255)
    rank = models.IntegerField()

    class Meta:
        verbose_name = 'Course Recommend'
        ordering = ['id']


