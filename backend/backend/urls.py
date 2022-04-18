from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import MyTokenObtainPairView
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    # path('api/accounts/', include('accounts.urls')),
    path('accounts/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('accounts/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('accounts/', include('accounts.urls')),
    path('student/', include('student.urls')),
    path('school/', include('school.urls')),
    path('myadmin/', include('myadmin.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
admin.site.site_header = 'Admin'

if settings.DEBUG:
    # import debug_toolbar
    
    urlpatterns = [
        # path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

