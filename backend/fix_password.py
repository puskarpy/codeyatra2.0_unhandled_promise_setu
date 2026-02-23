#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setu.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Fix the SSbee user (ID 6)
user = User.objects.get(username='SSbee')
print(f"Before fix:")
print(f"  Email: {user.email}")
print(f"  Password hash: {user.password[:30]}...")

# Set the password properly (this will hash it correctly)
user.set_password('Hello@1234')
user.save()

print(f"\nAfter fix:")
print(f"  Password hash: {user.password[:30]}...")
print(f"\n✅ Password has been fixed! Now it's properly hashed.")
print(f"\nYou can now login with:")
print(f"  Email: {user.email}")
print(f"  Password: Hello@1234")
