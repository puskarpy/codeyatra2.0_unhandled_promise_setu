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
		phone = request.data.get('phone')
		password = request.data.get('password')
		
		# Support login by email or phone
		user = None
		try:
			if email:
				user = User.objects.get(email=email)
			elif phone:
				user = User.objects.get(phone=phone)
			else:
				return Response({'detail': 'Email or phone required'}, status=status.HTTP_400_BAD_REQUEST)
		except User.DoesNotExist:
			return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
		
		# Check password
		if user and user.check_password(password):
			refresh = RefreshToken.for_user(user)
			LoginAttempt.objects.create(user=user, successful=True)
			return Response({
				'refresh': str(refresh),
				'access': str(refresh.access_token),
				'user': {
					'id': user.id,
					'email': user.email,
					'username': user.username,
					'is_staff': user.is_staff,
					'is_office_admin': user.is_office_admin
				}
			})
		else:
			if user:
				LoginAttempt.objects.create(user=user, successful=False)
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
