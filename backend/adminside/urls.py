from django.urls import path, include
from .views import AdminLoginView, UserViewSet, BooksCategoryViewset
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'categories', BooksCategoryViewset, basename='categories')
urlpatterns = [
    path('login/',AdminLoginView.as_view(), name='admin_login'),
    path('', include(router.urls)), 
]