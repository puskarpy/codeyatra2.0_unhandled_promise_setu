<<<<<<< HEAD
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.

class User(AbstractUser):
    phone = models.CharField(max_length=15, unique=True)
    is_phone_verified = models.BooleanField(default=False)
    language = models.CharField(max_length=10, default='ne')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.phone})"

class PhoneOTP(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def str(self):
        return f"OTP for {self.user.phone} - Used: {self.is_used}"
=======

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class UserManager(BaseUserManager):
	def create_user(self, username, phone, password=None, **extra_fields):
		if not phone:
			raise ValueError('The Phone number must be set')
		user = self.model(username=username, phone=phone, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, username, phone, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		return self.create_user(username, phone, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
	username = models.CharField(max_length=150, unique=True)
	phone = models.CharField(max_length=15, unique=True)
	email = models.EmailField(max_length=255, unique=True, null=True, blank=True)
	is_phone_verified = models.BooleanField(default=False)
	language = models.CharField(max_length=20, default='en')
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	date_joined = models.DateTimeField(default=timezone.now)
	updated_at = models.DateTimeField(auto_now=True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username', 'phone']

	objects = UserManager()

	def __str__(self):
		return self.email

class OTP(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
	code = models.CharField(max_length=6)
	created_at = models.DateTimeField(auto_now_add=True)
	is_used = models.BooleanField(default=False)

	def __str__(self):
		return f"OTP for {self.user.phone}: {self.code}"

class LoginAttempt(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_attempts')
	timestamp = models.DateTimeField(auto_now_add=True)
	successful = models.BooleanField(default=False)

	def __str__(self):
		return f"LoginAttempt by {self.user.phone} at {self.timestamp}"
>>>>>>> origin/sujan
