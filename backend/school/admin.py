from django.contrib import admin
from .models import Exam, Question, Subject, Choice
from django.contrib import admin

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'type', 'score')
    search_fields = ('text',)

class ChoicesAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'correct')
    search_fields = ('text',)

class ExamAdmin(admin.ModelAdmin):
    list_display = ('school', 'csv_file', 'time_limit', 'is_published')
    search_fields = ('school',)
    list_filter = ('is_published',)

class SubjectAdmin(admin.ModelAdmin):
    list_display = ('exam', 'name', )
    search_fields = ('exam', 'name',)

admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice, ChoicesAdmin)
admin.site.register(Exam, ExamAdmin)
admin.site.register(Subject, SubjectAdmin)
