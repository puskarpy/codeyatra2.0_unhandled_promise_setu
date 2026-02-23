from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    qr_code_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = ['id', 'user_name', 'citizenship_number', 'province', 'district', 
                  'city', 'office', 'qr_code', 'qr_code_url', 'submitted_at']
        read_only_fields = ['id', 'submitted_at', 'qr_code', 'qr_code_url']

    def get_qr_code_url(self, obj):
        if obj.qr_code:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.qr_code.url)
            return obj.qr_code.url
        return None


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['user_name', 'citizenship_number', 'province', 'district', 'city', 'office']

    def validate_citizenship_number(self, value):
        # Check if appointment with same citizenship number already exists
        if Appointment.objects.filter(citizenship_number=value).exists():
            raise serializers.ValidationError("An appointment with this citizenship number already exists.")
        return value

    def validate_user_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("User name must be at least 2 characters long.")
        return value.strip()

    def validate_district(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("District name must be at least 2 characters long.")
        return value.strip()

    def validate_city(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("City name must be at least 2 characters long.")
        return value.strip()

    def create(self, validated_data):
        appointment = Appointment.objects.create(**validated_data)
        return appointment
