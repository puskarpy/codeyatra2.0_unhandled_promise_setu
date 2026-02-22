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
