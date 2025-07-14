from django.urls import path, include
from .views import AdminLoginView
from rest_framework.routers import DefaultRouter
urlpatterns = [
    path('login/',AdminLoginView.as_view(), name='admin_login'),
]