from django.shortcuts import render
from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import generics, permissions, status, viewsets, serializers, mixins
from account.models import Users

class AdminLoginView(APIView):
    def post(self,request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email,password = password)

        if user is not None and user.is_superuser:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh' : str(refresh),
                'access' : str(refresh.access_token),
                  'is_superuser': user.is_superuser
            })
        return Response({'detail' : 'Invalid credentials or not an admin '}, status=status.HTTP_401_UNAUTHORIZED)

    
