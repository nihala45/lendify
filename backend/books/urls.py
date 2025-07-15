from django.urls import path
from .views import AdminBookListCreateView, AdminBookDetailUpdateDeleteView

urlpatterns = [
    path('admin/', AdminBookListCreateView.as_view(), name='admin_books'),
    path('admin/<int:pk>/', AdminBookDetailUpdateDeleteView.as_view(), name='admin_book_detail'),
]