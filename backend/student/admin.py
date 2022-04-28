from django.contrib import admin

from .models import Result, ResultDetails, CourseRecommended

class ResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'school',)
    search_fields = ('student', 'school',)
    list_filter = ('school',)

class ResultDetailsAdmin(admin.ModelAdmin):
    search_fields = ('result__student__user__name', )

class CourseRecommendedAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'rank', 'course',)
    search_fields = ('result__student__user__name', )

admin.site.register(Result, ResultAdmin)
admin.site.register(ResultDetails, ResultDetailsAdmin)
admin.site.register(CourseRecommended, CourseRecommendedAdmin)
