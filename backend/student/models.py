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
    formula = models.CharField(max_length=255, default='')
    video = models.CharField(max_length=255, default='None')
    tab_switch = models.CharField(max_length=255, default=0)
    regression_model = models.CharField(max_length=255, default='')

    class Meta:
        verbose_name = 'Exam Result'
        ordering = ['-id']

    def __str__(self):
        return '{} - {}'.format(self.student.user.name, self.school.name)

class ResultDetails(models.Model):
    result = models.ForeignKey(
        Result, related_name="result_details", on_delete=models.CASCADE)
    score = models.IntegerField()
    subject = models.CharField(max_length=255)
    overall = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Result Detail'

    def __str__(self):
        return '{} - {}'.format(self.result.student.user.name, self.subject)


class CourseRecommended(models.Model):
    result = models.ForeignKey(
        Result, related_name="result_courses", on_delete=models.CASCADE)
    course = models.CharField(max_length=255)
    rank = models.IntegerField()

    class Meta:
        verbose_name = 'Course Recommend'
        ordering = ['id']

    def __str__(self):
        return '{} - {}'.format(self.result.student.user.name, self.result.school.name)


