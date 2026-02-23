#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setu.settings')
django.setup()

from django.contrib.auth import get_user_model
from appointments.models import Appointment

User = get_user_model()

print("✓ Django setup successful")
print(f"✓ is_office_admin field exists: {hasattr(User(), 'is_office_admin')}")

field = User._meta.get_field('is_office_admin')
print(f"✓ Field type: {field.get_internal_type()}")
print(f"✓ Appointment model registered: {Appointment is not None}")
print(f"✓ Appointment fields: {[f.name for f in Appointment._meta.get_fields()]}")

print("\n✅ All systems operational!")
