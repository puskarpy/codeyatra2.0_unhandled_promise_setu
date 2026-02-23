from django.contrib import admin
from .models import User, OTP, LoginAttempt

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ('id', 'username', 'phone', 'is_phone_verified', 'language', 'is_active', 'is_staff', 'date_joined')
	search_fields = ('username', 'phone')
	list_filter = ('is_phone_verified', 'is_active', 'is_staff', 'language')

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'code', 'created_at', 'is_used')
	search_fields = ('user__phone', 'code')
	list_filter = ('is_used',)

@admin.register(LoginAttempt)
class LoginAttemptAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'timestamp', 'successful')
	search_fields = ('user__phone',)
	list_filter = ('successful',)
