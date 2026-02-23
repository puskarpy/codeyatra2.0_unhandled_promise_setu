from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Appointment(models.Model):

    PROVINCES = [
        ('bagmati', 'Bagmati'),
        ('gandaki', 'Gandaki'),
        ('karnali', 'Karnali'),
        ('koshi', 'Koshi'),
        ('madhesh', 'Madhesh'),
        ('rasuwa', 'Rasuwa'),
    ]

    OFFICES = [
        ('kathmandu', 'Kathmandu Office'),
        ('pokhara', 'Pokhara Office'),
        ('dharan', 'Dharan Office'),
        ('biratnagar', 'Biratnagar Office'),
        ('butwal', 'Butwal Office'),
        ('birgunj', 'Birgunj Office'),
    ]

    SERVICES = [
        ('citizenship', 'Citizenship Certificate'),
        ('passport_apply', 'Passport Application'),
        ('passport_renew', 'Passport Renewal'),
        ('driving_license', 'Driving License'),
        ('land_registration', 'Land Registration'),
        ('business_registration', 'Business Registration'),
        ('birth_certificate', 'Birth Certificate'),
        ('marriage_certificate', 'Marriage Certificate'),
        ('pan_registration', 'PAN Registration'),
        ('tax_consultation', 'Tax Consultation'),
    ]

    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)

    province = models.CharField(max_length=50, choices=PROVINCES)
    office = models.CharField(max_length=50, choices=OFFICES)
    services = models.CharField(max_length=50, choices=SERVICES)

    citizenship_number = models.CharField(max_length=50, unique=True)

    purpose_of_visit = models.TextField(max_length=1000, blank=True)

    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)

    submitted_at = models.DateTimeField(auto_now_add=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointments'
    )

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"

    def __str__(self):
        return f"{self.full_name} - {self.get_office_display()}"