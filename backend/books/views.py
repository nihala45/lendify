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
from account.models import Users
from django.db.models import Count


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
        book = get_object_or_404(Book, pk=book_id)

        if book.available_copies < 1:
            return Response(
                {"error": "No copies available to borrow."},
                status=status.HTTP_400_BAD_REQUEST
            )

        borrow, created = Borrow.objects.get_or_create(
            user=request.user,
            book=book,
            defaults={
                "status": "pending",
                "borrow_date": None,
            }
        )
        if not created:
            return Response(
                {"error": "You already have a borrow record for this book."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"status": borrow.status}, status=status.HTTP_201_CREATED)

    def patch(self, request, book_id):
        borrow = get_object_or_404(Borrow, user=request.user, book_id=book_id)
        new_status = request.data.get("status")

        if new_status not in dict(Borrow.STATUS_CHOICES):
            return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

        # User can only request return
        if new_status != "return_requested":
            return Response(
                {"error": "Users can only request a return."},
                status=status.HTTP_400_BAD_REQUEST
            )

        borrow.status = new_status
        borrow.save()
        return Response({"status": borrow.status}, status=status.HTTP_200_OK)


class AdminBorrowListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        borrows = Borrow.objects.select_related("user", "book").all()
        serializer = BorrowSerializer(borrows, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        borrow = get_object_or_404(Borrow, pk=pk)
        old_status = borrow.status
        new_status = request.data.get("status")

        if new_status not in dict(Borrow.STATUS_CHOICES):
            return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

        if old_status == new_status:
            return Response({"status": borrow.status}, status=status.HTTP_200_OK)

        book = borrow.book

        if new_status == "delivered":
            if book.available_copies < 1:
                return Response(
                    {"error": "No available copies for delivery."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            book.available_copies -= 1
            book.times_read += 1
            borrow.delivered_date = timezone.now().date()
           
            book.save()

        elif new_status == "returned":
            book.available_copies += 1
            borrow.return_date = timezone.now().date()
           
            book.save()

        
        borrow.status = new_status
        borrow.save()

        return Response({"status": borrow.status}, status=status.HTTP_200_OK)
    
class UserBorrowListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BorrowSerializer

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("user_id")

        if not user_id:
            return Response({"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Users.objects.get(pk=user_id)
        except Users.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Security check: ensure logged-in user matches the requested user_id
        if user != request.user:
            return Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
      

        borrows = Borrow.objects.filter(user=user).select_related('book')
        serializer = BorrowSerializer(borrows, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class BookRecommendations(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user_id = request.query_params.get("user_id")

        if not user_id:
            return Response({"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check user's borrowing history (delivered books)
        borrows = Borrow.objects.filter(user_id=user_id, status="delivered")

        if borrows.exists():
            # Extract categories the user has read
            categories = borrows.values_list("book__category_id", flat=True).distinct()

            # Recommend other books in these categories
            books = (
                Book.objects.filter(category_id__in=categories)
                .annotate(num_borrows=Count("borrow"))
                .order_by("-times_read")[:5]
            )
        else:
            # Fallback: globally popular books
            books = (
                Book.objects.filter(times_read__gt=0)
                .order_by("-times_read")[:5]
            )

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
