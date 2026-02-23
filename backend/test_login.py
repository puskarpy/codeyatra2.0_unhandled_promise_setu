#!/usr/bin/env python
"""
Test script to verify the login endpoint works correctly.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

print("=" * 60)
print("TESTING APPOINTMENT BOOKING SYSTEM LOGIN")
print("=" * 60)

# Test data
test_cases = [
    {
        "name": "Login with email",
        "data": {
            "email": "sujanbhusal02@gmail.com",
            "password": "Hello@1234"
        }
    },
    {
        "name": "Login with phone",
        "data": {
            "email": "",
            "phone": "945689456",
            "password": "Hello@1234"
        }
    }
]

for test in test_cases:
    print(f"\n📝 Test: {test['name']}")
    print(f"   Data: {test['data']}\n")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/user/login/",
            json=test['data'],
            timeout=5
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Login successful!")
            print(f"   User: {data.get('user', {}).get('username')}")
            print(f"   is_office_admin: {data.get('user', {}).get('is_office_admin')}")
            print(f"   Access Token: {data.get('access', '')[:50]}...")
            print(f"   Refresh Token: {data.get('refresh', '')[:50]}...")
        else:
            print(f"   ❌ Login failed!")
            print(f"   Response: {response.json()}")
    
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Connection error!")
        print(f"   Make sure the server is running: python manage.py runserver")
    except Exception as e:
        print(f"   ❌ Error: {e}")

print("\n" + "=" * 60)
print("NEXT STEPS:")
print("=" * 60)
print("""
1. Start Django server:
   python manage.py runserver

2. Test the system:
   - Appointment Form: http://localhost:8000/api/appointments/form/
   - Admin Dashboard: http://localhost:8000/api/appointments/admin/dashboard/
   - Django Admin: http://localhost:8000/admin/

3. Login credentials:
   Email: sujanbhusal02@gmail.com
   Password: Hello@1234
   (or Phone: 945689456 + Password: Hello@1234)
""")
print("=" * 60)
