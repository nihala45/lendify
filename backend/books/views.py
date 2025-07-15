from rest_framework import viewsets, permissions, status, generics, views, filters
from .models import Book, Borrow
from .serializers import BookSerializer, BorrowSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.views import APIView
from adminside.models import BooksCategory
from adminside.serializers import CategorySerializer
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404



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
    

class BookGenreListViewset(ListAPIView):
    queryset = BooksCategory.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    
    

class PublicBookPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'author']   
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = Book.objects.filter(available_copies__gt=0)
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        return queryset
    
    
    
class BookDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    
class BorrowStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, book_id):
        borrow = Borrow.objects.filter(user=request.user, book_id=book_id).first()
        if borrow:
            return Response({"status": borrow.status}, status=status.HTTP_200_OK)
        return Response({"status": "available"}, status=status.HTTP_200_OK)

    def post(self, request, book_id):
        # Initiate borrow request
        borrow, created = Borrow.objects.get_or_create(
            user=request.user,
            book_id=book_id,
            defaults={"status": "pending"}
        )
        return Response({"status": borrow.status}, status=status.HTTP_201_CREATED)

    def patch(self, request, book_id):
        # Update borrow status
        borrow = get_object_or_404(Borrow, user=request.user, book_id=book_id)
        new_status = request.data.get("status")
        if new_status in dict(Borrow.STATUS_CHOICES):
            borrow.status = new_status
            borrow.save()
            return Response({"status": borrow.status}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)




class AdminBorrowListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        borrows = Borrow.objects.select_related('user', 'book').all()
        serializer = BorrowSerializer(borrows, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        borrow = Borrow.objects.get(pk=pk)
        new_status = request.data.get('status')
        if new_status in dict(Borrow.STATUS_CHOICES):
            borrow.status = new_status
            borrow.save()
            return Response({"status": borrow.status}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)