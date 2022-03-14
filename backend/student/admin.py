from django.contrib import admin

from .models import Result, ResultDetails, CourseRecommended

class ResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'school')
    search_fields = ('student', 'school',)
    list_filter = ('school',)

admin.site.register(Result, ResultAdmin)

admin.site.register((ResultDetails, CourseRecommended, ))
