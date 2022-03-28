from django.urls import path
from .views import SchoolListCreateAPI, SchoolUpdateDestroyAPI, StudentAPI, DashboardDetails

urlpatterns = [
    path("schools/", SchoolListCreateAPI.as_view()),
    path("schools/<int:pk>/", SchoolUpdateDestroyAPI.as_view()),
    path("students/", StudentAPI.as_view()),
    path("dashboard/", DashboardDetails.as_view()),
]



