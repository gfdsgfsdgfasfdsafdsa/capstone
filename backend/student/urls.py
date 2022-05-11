from django.urls import path, include

from .views import StartExamApi, SubmitExamApi, ResultApi, ResultsApi, SchoolList, \
    Notification, NotificationDetails, AvailableCourses, DashboardDetails, SubmitResultDetails

urlpatterns = [
    # with put
    path("schools/", SchoolList.as_view()),
    path("exam/start/<int:pk>/", StartExamApi.as_view()),
    path("exam/submit/<int:pk>/", SubmitExamApi.as_view()),
    path("exam/result/<int:pk>/", ResultApi.as_view()),
    path("exam/results/", ResultsApi.as_view()),
    path('notification/', Notification.as_view()),
    path('notification/details/', NotificationDetails.as_view()),
    path('school/courses/<int:pk>/', AvailableCourses.as_view()),
    path('dashboard/', DashboardDetails.as_view()),
    path("exam/submit/video/<int:pk>/", SubmitResultDetails.as_view()),
]



