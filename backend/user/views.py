import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from.serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .auth_serializers import PhoneTokenObtainPairSerializer
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated
from .models import PhoneOTP

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


class SendOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        otp = str(random.randint(100000, 999999))

        expires_at = timezone.now() + timedelta(minutes=5)

        PhoneOTP.objects.create(
            user=user,
            otp_code=otp,
            expires_at=expires_at
        )

        # ⚠️ For now we just return OTP (in production send SMS)
        return Response({
            "message": "OTP sent successfully",
            "otp": otp
        })
    
class VerifyOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        otp_code = request.data.get("otp")

        try:
            otp = PhoneOTP.objects.filter(
                user=user,
                otp_code=otp_code,
                is_used=False
            ).latest('created_at')
        except PhoneOTP.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=400)

        if otp.expires_at < timezone.now():
            return Response({"error": "OTP expired"}, status=400)

        otp.is_used = True
        otp.save()

        user.is_phone_verified = True
        user.save()

        return Response({"message": "Phone verified successfully"})
    
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)