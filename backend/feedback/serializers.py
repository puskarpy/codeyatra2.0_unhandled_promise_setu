from rest_framework import serializers
from .models import Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'user', 'service', 'officer', 'rating', 'comment', 'created_at', 'updated_at']
