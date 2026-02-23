from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'citizenship_number', 'office', 'province', 'submitted_at')
    list_filter = ('office', 'province', 'submitted_at')
    search_fields = ('user_name', 'citizenship_number', 'district', 'city')
    readonly_fields = ('submitted_at', 'qr_code')
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('user_name', 'citizenship_number')
        }),
        ('Location', {
            'fields': ('province', 'district', 'city', 'office')
        }),
        ('QR Code & Metadata', {
            'fields': ('qr_code', 'submitted_at')
        }),
    )
