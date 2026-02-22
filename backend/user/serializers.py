from rest_framework import serializers
from .models import User, OTP, LoginAttempt

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'phone']

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            phone=validated_data.get('phone')
        )
        user.set_password(validated_data['password'])  # 🔥 THIS IS IMPORTANT
        user.save()
        return user
    
class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['id', 'user', 'code', 'created_at', 'is_used']

class LoginAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginAttempt
        fields = ['id', 'user', 'timestamp', 'successful']
