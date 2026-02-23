#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setu.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Set is_office_admin for the admin user
user = User.objects.get(username='SSbee')
user.is_office_admin = True
user.save()

print(f"✅ User '{user.username}' has been updated:")
print(f"   Email: {user.email}")
print(f"   is_staff: {user.is_staff}")
print(f"   is_office_admin: {user.is_office_admin}")
print(f"\n✅ You can now:")
print(f"   1. Login at /api/user/login/")
print(f"   2. Access admin dashboard at /api/appointments/admin/dashboard/")
