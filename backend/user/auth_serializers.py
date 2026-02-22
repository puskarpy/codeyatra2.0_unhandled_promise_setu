from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User

class PhoneTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'phone'

    def validate(self, attrs):
        phone = attrs.get('phone')
        password = attrs.get('password')

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid phone number")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid password")

        data = super().get_token(user)

        return {
            'refresh': str(data),
            'access': str(data.access_token),
        }