from .views import ProfileApiView, StudentRegistration, ActivateAccount

from django.urls import path

'''
router = DefaultRouter()
router.register("profile", ProfileViewSet)
'''

urlpatterns = [
    path('profile/', ProfileApiView.as_view()),
    path('registration/student/', StudentRegistration.as_view()),
    path('activate/', ActivateAccount.as_view()),
]




