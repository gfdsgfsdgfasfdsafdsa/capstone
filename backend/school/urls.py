from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import ExamViewSet, QuestionUpdateDestroy, QuestionListCreate, SchoolExamRetrieve, CsvData, \
    StudentExamResults, StudentExamResult, StudentAppliedList, NotificationDetails, Notification,\
    DashboardDetails, ImportQuestion, ExportCSV, ExportResult

router = DefaultRouter()
router.register("exam", ExamViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("exam/subject/<int:pk>/questions/", QuestionListCreate.as_view()),
    path("exam/subject/questions/<int:pk>/", QuestionUpdateDestroy.as_view()),
    path("schools/<int:pk>/", SchoolExamRetrieve.as_view()),
    path("exam/students/applied/", StudentAppliedList.as_view()),
    path("exam/student/results/", StudentExamResults.as_view()),
    path("exam/student/results/<int:pk>/", StudentExamResult.as_view()),
    path("csv/<int:page>/", CsvData.as_view()),
    path('notification/', Notification.as_view()),
    path('notification/details/', NotificationDetails.as_view()),
    path('dashboard/', DashboardDetails.as_view()),
    path("import/question/subject/<int:pk>/", ImportQuestion.as_view()),
    path("export/csv/", ExportCSV.as_view()),
    path("export/result/", ExportResult.as_view()),
]



