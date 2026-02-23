# Appointment Booking System - Complete Testing Guide

## Part 1: Backend Setup Verification

### Step 1: Verify Installation
```bash
cd backend

# Check Django version
python -m django --version  # Should be 4.2 or higher

# Verify required packages installed
python -c "import qrcode; print('✓ qrcode installed')"
python -c "import rest_framework; print('✓ rest_framework installed')"
python -c "import PIL; print('✓ PIL/Pillow installed')"
```

### Step 2: Database Migration Verification
```bash
# Check current migrations
python manage.py showmigrations

# Create new migrations (if any)
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Verify migration status
python manage.py migrate --list
```

### Step 3: Admin Setup
```bash
# Create superuser
python manage.py createsuperuser

# Verify user creation
python manage.py shell
```

Inside Python shell:
```python
from django.contrib.auth import get_user_model
User = get_user_model()

# List all users
print(User.objects.all())

# Set is_office_admin for your user
user = User.objects.get(username='admin')
user.is_office_admin = True
user.save()
print(f"Updated {user.username} - is_office_admin: {user.is_office_admin}")

exit()
```

---

## Part 2: API Endpoint Testing

### Start the Server
```bash
python manage.py runserver
```

The server should start at: `http://localhost:8000`

### Test 1: Health Check
```bash
curl http://localhost:8000/admin/
# Should return Django admin login page (200 OK)
```

### Test 2: Create Appointment (Public API)

**Request:**
```bash
curl -X POST http://localhost:8000/api/appointments/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "Ramesh Kumar",
    "citizenship_number": "123-45-67890",
    "province": "bagmati",
    "district": "Kathmandu",
    "city": "Kathmandu",
    "office": "kathmandu"
  }'
```

**Expected Response (201 Created):**
```json
{
    "id": 1,
    "user_name": "Ramesh Kumar",
    "citizenship_number": "123-45-67890",
    "province": "bagmati",
    "district": "Kathmandu",
    "city": "Kathmandu",
    "office": "kathmandu",
    "qr_code": "/media/qr_codes/qr_123-45-67890.png",
    "qr_code_url": "http://localhost:8000/media/qr_codes/qr_123-45-67890.png",
    "submitted_at": "2024-02-23T10:30:00Z"
}
```

**Verification:**
- Status should be 201
- QR code file should be created at: `backend/media/qr_codes/qr_123-45-67890.png`
- Can access QR code image directly via browser

### Test 3: Get QR Code separately

**Request:**
```bash
curl http://localhost:8000/api/appointments/1/get_qr_code/
```

**Expected Response (200 OK):**
```json
{
    "id": 1,
    "qr_code_url": "http://localhost:8000/media/qr_codes/qr_123-45-67890.png"
}
```

### Test 4: List Appointments (Admin API)

**Get JWT Token:**
```bash
# First, get your token from the user API (adjust as needed)
curl -X POST http://localhost:8000/api/user/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

**List Appointments:**
```bash
curl -X GET http://localhost:8000/api/appointments/list_all/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
Array of all appointments

### Test 5: List with Filters

**By Office:**
```bash
curl -X GET "http://localhost:8000/api/appointments/list_all/?office=kathmandu" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**By Date:**
```bash
curl -X GET "http://localhost:8000/api/appointments/list_all/?start_date=2024-02-01" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test 6: Appointment Form Page
```bash
# In browser or curl
curl http://localhost:8000/api/appointments/form/
# Should return HTML form
```

### Test 7: Admin Dashboard Page

```bash
# Note: This requires browser cookies for session auth
# Visit in browser: http://localhost:8000/api/appointments/admin/dashboard/
# Login when prompted
```

---

## Part 3: Frontend Testing

### Open Appointment Form
1. Open browser
2. Navigate to: `http://localhost:8000/api/appointments/form/`
3. You should see a form with fields:
   - Full Name
   - Citizenship Number
   - Province (dropdown)
   - District
   - City
   - Office (dropdown)

### Test Form Validation
1. **Empty name**: Leave name empty, click elsewhere → Should show error
2. **Short citizenship**: Enter "123" → Should show error
3. **Missing province**: Try to submit without selecting province → Should block
4. **Missing office**: Try to submit without selecting office → Should block

### Test Form Submission
1. Fill all fields with valid data:
   - Name: "Test User"
   - Citizenship: "456-78-90123"
   - Province: "bagmati"
   - District: "Kathmandu"
   - City: "Kathmandu"
   - Office: "kathmandu"
2. Click "Submit Appointment"
3. Should see:
   - Success message
   - QR code image displayed
   - "Book Another Appointment" button

### Test QR Code
1. After submission, QR code should be visible
2. Can save the image
3. When scanned (using QR code reader), should contain appointment data

### Test Reset
1. Click "Book Another Appointment"
2. Form should clear and be ready for new entry

---

## Part 4: Admin Dashboard Testing

### Access Dashboard
1. Open browser
2. Navigate to: `http://localhost:8000/api/appointments/admin/dashboard/`
3. Should be redirected to login (if not authenticated)
4. Login with admin credentials
5. Should see table with appointments

### Test Filters
1. **Filter by Office:**
   - Select office from dropdown
   - Click "Apply Filters"
   - Table should update

2. **Filter by Date:**
   - Select start date
   - Click "Apply Filters"
   - Table should show only appointments from that date

3. **Clear Filters:**
   - Click "Clear Filters"
   - Table should reset to show all appointments

### Test QR Code Modal
1. Click "View QR" button on any appointment
2. Modal should open with QR code
3. Should have "Download QR Code" button
4. Click download (should save PNG file)
5. Click X or outside modal to close

### Test Logout
1. Click "Logout" button
2. Should be redirected/logged out
3. Cannot access dashboard without logging in again

---

## Part 5: Frontend + Backend Integration Test

### End-to-End Test Scenario:
1. **Submit Appointment via Form:**
   - Go to `/api/appointments/form/`
   - Submit with data: "Integration Test User", "999-88-77666"

2. **Verify in Admin Dashboard:**
   - Go to `/api/appointments/admin/dashboard/`
   - Filter by office "kathmandu"
   - Should see the newly created appointment

3. **View QR Code:**
   - Click "View QR" on the new appointment
   - Verify QR code displays correctly
   - Download the QR code

4. **Verify via API:**
   - Use curl to get `/api/appointments/list_all/`
   - Should see the appointment in the list

---

## Part 6: Database Verification

```bash
python manage.py dbshell
```

Inside SQLite shell:
```sql
-- Check appointments table structure
.schema appointments_appointment

-- List all appointments
SELECT * FROM appointments_appointment;

-- Check specific appointment and QR code file path
SELECT id, user_name, citizenship_number, qr_code FROM appointments_appointment WHERE id = 1;

-- Check user admin flag
SELECT id, username, is_office_admin FROM user_user WHERE is_staff = 1;

.exit
```

---

## Part 7: File System Verification

### Check Directory Structure
```bash
# Backend directories
ls -la backend/appointments/

# Should have:
# - migrations/
# - services/
# - static/
# - templates/

# Check static files
ls -la backend/appointments/static/
ls -la backend/appointments/static/js/
ls -la backend/appointments/static/css/

# Check templates
ls -la backend/appointments/templates/

# Check media files
ls -la backend/media/
ls -la backend/media/qr_codes/
```

---

## Part 8: Common Issues & Solutions

### Issue: "Module not found" error
**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Issue: QR code not generating
**Solution:**
```bash
# Create media folders
mkdir -p backend/media/qr_codes
chmod 755 backend/media
chmod 755 backend/media/qr_codes

# Verify Pillow is installed
python -c "from PIL import Image; print('Pillow OK')"
```

### Issue: Admin dashboard shows 403
**Solution:**
1. Verify logged in with admin account
2. Check is_office_admin is True:
   ```bash
   python manage.py shell
   from django.contrib.auth import get_user_model
   User = get_user_model()
   user = User.objects.get(username='admin')
   print(user.is_office_admin)
   ```

### Issue: CORS Error in console
**Solution:** Already configured in settings, but if needed:
```python
# In settings.py
CORS_ALLOW_ALL_ORIGINS = True  # For development only
```

### Issue: Static files not loading
**Solution:**
```bash
python manage.py collectstatic --noinput
```

---

## Part 9: Performance Testing

### Load Test - Create Multiple Appointments
```bash
#!/bin/bash
for i in {1..50}; do
  curl -X POST http://localhost:8000/api/appointments/ \
    -H "Content-Type: application/json" \
    -d "{
      \"user_name\": \"User $i\",
      \"citizenship_number\": \"$i-$i-$i$i$i\",
      \"province\": \"bagmati\",
      \"district\": \"Kathmandu\",
      \"city\": \"Kathmandu\",
      \"office\": \"kathmandu\"
    }"
  sleep 0.1
done
```

### Monitor Performance
```bash
# Check response times
curl -w "Time: %{time_total}s\n" http://localhost:8000/api/appointments/list_all/

# Check server logs for errors
tail -f backend/debug.log  # if logging is enabled
```

---

## Success Criteria

✅ **Backend Tests Pass:**
- [ ] All models created successfully
- [ ] Migrations applied without errors
- [ ] Admin user created and configured
- [ ] API endpoints respond correctly
- [ ] QR codes generated and stored
- [ ] Database structure correct

✅ **Frontend Tests Pass:**
- [ ] Form displays correctly
- [ ] Field validation works
- [ ] Form submission successful
- [ ] QR code displays after submission
- [ ] Admin dashboard loads for authenticated users
- [ ] Filters work correctly

✅ **Integration Tests Pass:**
- [ ] Appointment created → appears in dashboard
- [ ] QR code scannable and contains correct data
- [ ] Admin can view and filter all appointments
- [ ] No console errors or warnings

---

## Next Steps After Testing

1. **Deploy to Production:**
   - Use production settings
   - Set DEBUG = False
   - Configure allowed hosts
   - Use production database

2. **Add More Features:**
   - Email notifications
   - SMS confirmations
   - Appointment status tracking
   - Payment integration

3. **Monitor & Maintain:**
   - Set up logging
   - Monitor QR code storage
   - Regular database backups
   - Performance monitoring

