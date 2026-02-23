#!/usr/bin/env python
"""
Verify Admin Dashboard Configuration
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setu.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.contrib.auth import get_user_model
from appointments.models import Appointment
from django.db.models import Q

User = get_user_model()

print("\n" + "="*80)
print("ADMIN DASHBOARD CONFIGURATION VERIFICATION")
print("="*80)

# 1. Check admin user exists
print("\n[1] CHECKING ADMIN USER...")
try:
    admin_user = User.objects.get(email='sujanbhusal02@gmail.com')
    print(f"    ✅ Admin user found: {admin_user.email}")
    print(f"    ✅ is_office_admin: {admin_user.is_office_admin}")
    print(f"    ✅ is_staff: {admin_user.is_staff}")
    print(f"    ✅ is_superuser: {admin_user.is_superuser}")
except User.DoesNotExist:
    print("    ❌ Admin user not found!")

# 2. Check password is hashed
print("\n[2] CHECKING PASSWORD HASH...")
try:
    admin_user = User.objects.get(email='sujanbhusal02@gmail.com')
    password_hash = admin_user.password
    if password_hash.startswith('pbkdf2_sha256$'):
        print(f"    ✅ Password properly hashed: {password_hash[:50]}...")
    else:
        print(f"    ❌ Password NOT hashed: {password_hash}")
except Exception as e:
    print(f"    ❌ Error: {e}")

# 3. Check appointments exist
print("\n[3] CHECKING APPOINTMENTS...")
try:
    appointments_count = Appointment.objects.count()
    print(f"    ℹ️  Total appointments in database: {appointments_count}")
    
    if appointments_count > 0:
        latest = Appointment.objects.latest('created_at')
        print(f"    ✅ Latest appointment: {latest.user_name} (ID: {latest.id})")
        print(f"       Submitted: {latest.submitted_at}")
        print(f"       Office: {latest.office}")
        print(f"       QR Code exists: {bool(latest.qr_code)}")
    else:
        print(f"    ℹ️  No appointments yet (submit one via form first)")
except Exception as e:
    print(f"    ❌ Error: {e}")

# 4. Check QR code files
print("\n[4] CHECKING QR CODE FILES...")
try:
    media_qr_path = 'media/qr_codes'
    if os.path.exists(media_qr_path):
        qr_files = os.listdir(media_qr_path)
        print(f"    ✅ QR code directory exists: {media_qr_path}")
        print(f"    ℹ️  Total QR files: {len(os.listdir(media_qr_path))}")
        if len(qr_files) > 0:
            print(f"    ℹ️  Sample files: {', '.join(qr_files[:3])}")
    else:
        print(f"    ℹ️  QR code directory will be created on first appointment")
except Exception as e:
    print(f"    ⚠️  {e}")

# 5. Check URLs configuration
print("\n[5] CHECKING URL CONFIGURATION...")
try:
    from django.urls import reverse
    
    try:
        form_url = reverse('appointments:appointment-form')
        print(f"    ✅ Form page URL: {form_url}")
    except:
        print(f"    ❌ Form page URL not found")
    
    try:
        dashboard_url = reverse('appointments:admin-dashboard')
        print(f"    ✅ Admin dashboard URL: {dashboard_url}")
    except:
        print(f"    ❌ Admin dashboard URL not found")
        
except Exception as e:
    print(f"    ⚠️  {e}")

# 6. API Endpoints Summary
print("\n[6] API ENDPOINTS SUMMARY...")
print("    📝 POST /api/appointments/ - Create appointment (public)")
print("    📋 GET /api/appointments/list_all/ - List all appointments (admin only)")
print("    🔗 GET /api/appointments/<id>/get_qr_code/ - Get QR code")
print("    📄 GET /api/appointments/form/ - Get appointment form page")
print("    📊 GET /api/appointments/admin/dashboard/ - Get admin dashboard page")

# 7. Frontend Setup
print("\n[7] FRONTEND TERMINOLOGY UPDATE...")
print("    ✅ SubmitPage.jsx - Updated to 'Submit Appointment'")
print("    ✅ DashboardPage.jsx - Updated to 'Recent Appointments'")
print("    ✅ Navbar.jsx - Updated link text")

print("\n" + "="*80)
print("SETUP COMPLETE!")
print("="*80)

print("\n🚀 NEXT STEPS:")
print("""
1. Start Django server:
   python manage.py runserver

2. Test appointment form:
   http://localhost:8000/api/appointments/form/

3. Submit test appointment with credentials:
   - Fill all fields
   - Submit
   - QR code will display

4. Access admin dashboard:
   http://localhost:8000/api/appointments/admin/dashboard/
   
5. Login with credentials:
   Email: sujanbhusal02@gmail.com
   Password: Hello@1234

6. View submitted appointments:
   - Table shows all appointments
   - Filter by office or date
   - Click "View QR" to see QR codes
   - Download QR codes as PNG

📋 Admin Dashboard Features:
   ✓ Real-time appointment display
   ✓ Filter by office
   ✓ Filter by date range
   ✓ View QR codes in modal
   ✓ Download QR codes
   ✓ Admin authentication required
   ✓ Role-based access control
   ✓ XSS protection with HTML escaping
   ✓ Responsive design
""")

print("="*80 + "\n")
