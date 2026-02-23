from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'phone']

    def create(self, validated_data):
        username = validated_data.get('username') or validated_data.get('phone')
        user = User(
            username=username,
            email=validated_data.get('email'),
            phone=validated_data.get('phone')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user