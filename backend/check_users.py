#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setu.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("=== Admin Users in Database ===\n")
admin_users = User.objects.filter(is_staff=True)

if not admin_users.exists():
    print("❌ No admin users found!")
else:
    for user in admin_users:
        print(f"ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Phone: {user.phone}")
        print(f"is_staff: {user.is_staff}")
        print(f"is_office_admin: {user.is_office_admin}")
        print(f"is_active: {user.is_active}")
        print(f"Has password set: {bool(user.password)}")
        print(f"Password hash: {user.password[:30]}...")
        print("-" * 50)

print("\n=== All Users ===")
all_users = User.objects.all()
print(f"Total users: {all_users.count()}\n")

for user in all_users:
    print(f"- {user.email} ({user.username}) - Staff: {user.is_staff}")
