from drf_spectacular.utils import extend_schema
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, PublicRegistrationSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = PublicRegistrationSerializer
    permission_classes = [AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(responses=UserSerializer)
    def get(self, request):
        return Response(UserSerializer(request.user).data)
