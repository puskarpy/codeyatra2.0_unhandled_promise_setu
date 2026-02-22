from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from.serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .auth_serializers import PhoneTokenObtainPairSerializer

# Create your views here.

class RegisterUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserListView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    

class UserDetailView(APIView):
    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        serializer = UserSerializer(user)
        return Response(serializer.data)
    

class PhoneLoginView(TokenObtainPairView):
    serializer_class = PhoneTokenObtainPairSerializer