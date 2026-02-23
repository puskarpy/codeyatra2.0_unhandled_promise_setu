<<<<<<< HEAD
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
=======
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import User, OTP, LoginAttempt
from .serializers import UserSerializer, OTPSerializer, LoginAttemptSerializer
import random

class RegisterView(generics.CreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.AllowAny]

	def post(self, request, *args, **kwargs):
		# Skip OTP for now
		return super().post(request, *args, **kwargs)

class LoginView(APIView):
	permission_classes = [permissions.AllowAny]
	def post(self, request):
		email = request.data.get('email')
		password = request.data.get('password')
		try:
			user = User.objects.get(email=email)
			if user.check_password(password):
				refresh = RefreshToken.for_user(user)
				LoginAttempt.objects.create(user=user, successful=True)
				return Response({
					'refresh': str(refresh),
					'access': str(refresh.access_token),
				})
			else:
				LoginAttempt.objects.create(user=user, successful=False)
				return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
		except User.DoesNotExist:
			return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RequestOTPView(APIView):
	permission_classes = [permissions.AllowAny]
	def post(self, request):
		phone = request.data.get('phone')
		try:
			user = User.objects.get(phone=phone)
		except User.DoesNotExist:
			return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
		code = f"{random.randint(100000, 999999)}"
		OTP.objects.create(user=user, code=code)
		# Here, integrate SMS/email sending logic
		return Response({'detail': f'OTP sent to {phone}', 'otp': code})

class VerifyOTPView(APIView):
	permission_classes = [permissions.AllowAny]
	def post(self, request):
		phone = request.data.get('phone')
		code = request.data.get('code')
		try:
			user = User.objects.get(phone=phone)
			otp = OTP.objects.filter(user=user, code=code, is_used=False).latest('created_at')
		except (User.DoesNotExist, OTP.DoesNotExist):
			return Response({'detail': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
		if (timezone.now() - otp.created_at).seconds > 300:
			return Response({'detail': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
		otp.is_used = True
		otp.save()
		user.is_phone_verified = True
		user.save()
		return Response({'detail': 'Phone verified'})

class UserInfoView(generics.RetrieveAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]
	def get_object(self):
		return self.request.user
>>>>>>> origin/sujan
