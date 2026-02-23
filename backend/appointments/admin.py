from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'full_name',
        'phone',
        'province',
        'office',
        'services',
        'submitted_at',
    )

    list_filter = (
        'province',
        'office',
        'services',
        'submitted_at',
    )

    search_fields = (
        'full_name',
        'phone',
        'citizenship_number',
        'email',
    )

    readonly_fields = (
        'submitted_at',
        'qr_code',
    )

    ordering = ('-submitted_at',)

    fieldsets = (
        ("Personal Information", {
            "fields": ("full_name", "phone", "email", "citizenship_number")
        }),
        ("Appointment Details", {
            "fields": ("province", "office", "services", "purpose_of_visit")
        }),
        ("System Info", {
            "fields": ("qr_code", "submitted_at", "created_by")
        }),
    )