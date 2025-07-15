from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminBookListCreateView, AdminBookDetailUpdateDeleteView, BookGenreListViewset,PublicBookPostViewSet, BorrowStatusView,BookDetailView, AdminBorrowListView, UserBorrowListView, BookRecommendations
router = DefaultRouter()

router = DefaultRouter()
router.register(r'public/books', PublicBookPostViewSet, basename='public-book')



urlpatterns = [
    path('admin/', AdminBookListCreateView.as_view(), name='admin_books'),
    path('admin/<int:pk>/', AdminBookDetailUpdateDeleteView.as_view(), name='admin_book_detail'),
    path('books/genre/', BookGenreListViewset.as_view(), name='book-genre'),
    path('books/detail/<int:pk>/', BookDetailView.as_view(), name='book-genre'),
    path('borrow/status/<int:book_id>/', BorrowStatusView.as_view(), name='borrow-status'),
    path('admin/borrow/list/', AdminBorrowListView.as_view(), name='admin-borrow-list'),
    path('admin/borrow/update/<int:pk>/', AdminBorrowListView.as_view(), name='admin-borrow-update'),
    path('borrow/user/', UserBorrowListView.as_view(), name='user-borrow-list'),
    path("recommendations/", BookRecommendations.as_view(), name="book-recommendations"),

    
   
    path('', include(router.urls)),
]

    