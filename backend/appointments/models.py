from django.db import models
from django.contrib.auth import get_user_model
import os

User = get_user_model()


class Appointment(models.Model):
    PROVINCES = [
        ('bagmati', 'Bagmati'),
        ('gandaki', 'Gandaki'),
        ('karnali', 'Karnali'),
        ('koshi', 'Koshi'),
        ('madhesh', 'Madhesh'),
        ('rasuwa', 'Rasuwa'),
    ]

    OFFICES = [
        ('kathmandu', 'Kathmandu Office'),
        ('pokhara', 'Pokhara Office'),
        ('dharan', 'Dharan Office'),
        ('biratnagar', 'Biratnagar Office'),
        ('butwal', 'Butwal Office'),
        ('birgunj', 'Birgunj Office'),
    ]

    user_name = models.CharField(max_length=255)
    citizenship_number = models.CharField(max_length=50, unique=True)
    province = models.CharField(max_length=50, choices=PROVINCES)
    district = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    office = models.CharField(max_length=50, choices=OFFICES)
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.user_name} - {self.office}"
