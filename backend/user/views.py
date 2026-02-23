from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from .models import User, OTP, LoginAttempt
from .serializers import UserSerializer
from .auth_serializers import CustomTokenObtainPairSerializer
import random


# User Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        # Ensure phone is required and unique
        phone = request.data.get("phone")
        if not phone:
            return Response({"detail": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(phone=phone).exists():
            return Response({"detail": "Phone already registered"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Phone + Password Login
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        password = request.data.get("password")

        if not phone or not password:
            return Response({"detail": "Phone and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            LoginAttempt.objects.create(user=user, successful=False)
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Successful login
        refresh = RefreshToken.for_user(user)
        LoginAttempt.objects.create(user=user, successful=True)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user":{
                "id": user.id,
                "username": user.username,
                "phone": user.phone,
                "email": user.email
            }
        })


# Request OTP (optional)
class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        if not phone:
            return Response({"detail": "Phone is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        code = f"{random.randint(100000, 999999)}"
        OTP.objects.create(user=user, code=code)
        # TODO: send OTP via SMS or email
        return Response({"detail": f"OTP sent to {phone}", "otp": code})


# Verify OTP
class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        code = request.data.get("code")

        if not phone or not code:
            return Response({"detail": "Phone and OTP code are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(phone=phone)
            otp = OTP.objects.filter(user=user, code=code, is_used=False).latest('created_at')
        except (User.DoesNotExist, OTP.DoesNotExist):
            return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if (timezone.now() - otp.created_at).seconds > 300:
            return Response({"detail": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save()
        user.is_phone_verified = True
        user.save()

        return Response({"detail": "Phone verified successfully"})


# Get current user info
class UserInfoView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# JWT login using custom serializer

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer