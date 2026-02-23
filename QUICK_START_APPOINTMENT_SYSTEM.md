# Quick Start Guide for Appointment Booking System

## Prerequisites
- Python 3.8+
- pip
- Django 4.2+

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Database Setup
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

### 3. Create Admin User
```bash
python manage.py createsuperuser

# Follow the prompts:
# Email: admin@example.com
# Username: admin
# Phone: 9841234567
# Password: (enter your password)
```

### 4. Grant Admin Access
```bash
python manage.py shell

# Inside the shell:
from django.contrib.auth import get_user_model
User = get_user_model()
admin = User.objects.get(username='admin')
admin.is_office_admin = True
admin.save()
exit()
```

Or use Django admin:
1. Navigate to: `http://localhost:8000/admin/`
2. Login with admin credentials
3. Go to Users section
4. Edit your admin user
5. Check "is_office_admin"
6. Save

### 5. Run Development Server
```bash
python manage.py runserver
```

### 6. Access the System

**Appointment Form:**
- URL: `http://localhost:8000/api/appointments/form/`
- Fill the form and submit
- QR code will appear automatically

**Admin Dashboard:**
- URL: `http://localhost:8000/api/appointments/admin/dashboard/`
- Login required (use the admin credentials created earlier)
- View all appointments and filter by office/date

**Django Admin:**
- URL: `http://localhost:8000/admin/`
- Manage users and check appointment submissions

---

## Test Data

### Sample Appointment
```json
{
    "user_name": "Ramesh Kumar",
    "citizenship_number": "123-45-67890",
    "province": "bagmati",
    "district": "Kathmandu",
    "city": "Kathmandu",
    "office": "kathmandu"
}
```

### Test with cURL
```bash
curl -X POST http://localhost:8000/api/appointments/ \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Ramesh Kumar","citizenship_number":"123-45-67890","province":"bagmati","district":"Kathmandu","city":"Kathmandu","office":"kathmandu"}'
```

---

## API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/appointments/` | POST | No | Create appointment |
| `/api/appointments/list_all/` | GET | Yes | List all appointments (admin only) |
| `/api/appointments/<id>/get_qr_code/` | GET | No | Get QR code for specific appointment |
| `/api/appointments/form/` | GET | No | Display appointment form |
| `/api/appointments/admin/dashboard/` | GET | Yes | Display admin dashboard |

---

## Features Implemented

✅ **Backend**
- Appointment model with all required fields
- QR code generation and storage
- Admin user role extension
- RESTful API endpoints
- Input validation (frontend & backend)
- Role-based access control

✅ **Frontend**
- Responsive appointment form
- Real-time field validation
- QR code display after submission
- Admin dashboard with table
- Filter by office and date
- QR code modal with download
- XSS protection

✅ **Database**
- SQLite (default Django)
- Automatic timestamps
- Unique citizenship numbers
- Organized data structure

✅ **Security**
- CSRF protection
- CORS configuration
- Input sanitization
- Role-based authorization
- Authentication required for admin

---

## Troubleshooting

### Module not found error
```bash
# Make sure you're in the backend directory
cd backend
pip install -r requirements.txt
```

### Migration errors
```bash
# Reset database (only for development)
python manage.py migrate appointments zero
python manage.py migrate
```

### QR code not generating
```bash
# Ensure media folder exists
mkdir media
mkdir media/qr_codes

# Check permissions
chmod 755 media
```

### Admin dashboard shows 403
1. Ensure you're logged in
2. Ensure `is_office_admin` is set to True for your user
3. Check the Django admin UI at `/admin/`

---

## Common Commands

```bash
# Start server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Django shell (for testing)
python manage.py shell

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run tests
python manage.py test appointments
```

---

## Next Steps

1. Test the appointment form at `/api/appointments/form/`
2. Create a few test appointments
3. Login with admin credentials
4. Visit admin dashboard at `/api/appointments/admin/dashboard/`
5. Test filtering and QR code download

For detailed documentation, see `APPOINTMENT_SYSTEM_README.md`

