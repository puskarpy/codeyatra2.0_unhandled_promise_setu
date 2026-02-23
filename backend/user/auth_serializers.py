from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD  # phone

    def validate(self, attrs):
        phone = attrs.get("phone")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"),
            phone=phone,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Invalid phone or password")

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "phone": user.phone,
                "email": user.email,
                "role": user.role,
            }
        }

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['phone'] = user.phone
        token['role'] = user.role

        return token