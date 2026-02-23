from rest_framework import serializers
<<<<<<< HEAD
from .models import User
=======
from .models import User, OTP, LoginAttempt
>>>>>>> origin/sujan

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
<<<<<<< HEAD
        fields = [
            'id',
            'username',
            'email',
            'phone',
            'password',
            'is_phone_verified',
            'language',
            'created_at'
        ]
        read_only_fields = ['is_phone_verified', 'created_at']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
=======
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
>>>>>>> origin/sujan
