from django.shortcuts import render
from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import generics, permissions, status, viewsets, serializers, mixins
from account.models import Users
from account.serializers import UserSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import BooksCategory
from .serializers import CategorySerializer

class CustomPageNumberPagination(PageNumberPagination):
    page_size=10
    page_size_query_param = 'page_size'
    max_page_size = 100

class AdminLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print(email, password, 'heyyyyyyyyyyyy')

        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            print("User does not exist")
            return Response(
                {'detail': 'Invalid credentials or not an admin'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        print(user, "USERRRRRRRRRRRRRRRRRRRRRR")

        if user.check_password(password) and user.is_superuser:
            print('user is there')
            refresh = RefreshToken.for_user(user)
            print(str(refresh), 'this is refresh token')
            print(str(refresh.access_token), 'this is access token')
            print(user.email, 'emailllll')
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_superuser': user.is_superuser,
                'email': user.email,
            })

        return Response(
            {'detail': 'Invalid credentials or not an admin'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    

class UserViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = CustomPageNumberPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'email', 'phone']

    def get_queryset(self):
        return Users.objects.filter(is_email_verified=True)

    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        try:
            user = Users.objects.get(pk=pk)
        except Users.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        user.is_active = False
        user.save()
        return Response(
            {'status': 'User blocked successfully.'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def unblock(self, request, pk=None):
        try:
            user = Users.objects.get(pk=pk)
        except Users.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        user.is_active = True
        user.save()
        return Response(
            {'status': 'User unblocked successfully.'},
            status=status.HTTP_200_OK
        )
        
        

class BooksCategoryViewset(viewsets.ModelViewSet):
    queryset = BooksCategory.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = CustomPageNumberPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Category deleted."}, status=status.HTTP_204_NO_CONTENT)
