from rest_framework import generics, permissions, filters
from .models import Book
from .serializers import BookSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser



class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
class AdminBookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter]
    pagination_class = CustomPageNumberPagination
    search_fields = ['title', 'author', 'category__name']
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser] 

    def perform_create(self, serializer):
        serializer.save()

    
    
class AdminBookDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]
