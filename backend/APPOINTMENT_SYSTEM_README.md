# Appointment Booking System - Complete Implementation Guide

## Overview
A comprehensive appointment booking system built with Django REST Framework backend and vanilla JavaScript frontend. Features include QR code generation, admin dashboard, filtering, and responsive design.

---

## Project Structure

```
appointments/
├── migrations/
├── services/
│   ├── __init__.py
│   └── qr_service.py          # QR code generation
├── static/
│   ├── css/
│   │   ├── appointment.css     # Appointment form styling
│   │   └── admin-dashboard.css # Admin dashboard styling
│   └── js/
│       ├── appointment-form.js # Form handling & validation
│       └── admin-dashboard.js  # Dashboard & API calls
├── templates/
│   ├── appointment_form.html   # Booking form page
│   └── admin_dashboard.html    # Admin dashboard page
├── __init__.py
├── admin.py                    # Django admin configuration
├── apps.py                     # App configuration
├── models.py                   # Appointment model
├── serializers.py              # DRF serializers
├── urls.py                     # URL routing
├── views.py                    # Views & ViewSets
└── tests.py
```

---

## Backend Setup

### 1. Models

#### Appointment Model
- `user_name`: Full name of the applicant
- `citizenship_number`: Unique citizenship identifier
- `province`: Selected province (Bagmati, Gandaki, Karnali, Koshi, Madhesh, Rasuwa)
- `district`: District name
- `city`: City/Municipality name
- `office`: Selected office location
- `qr_code`: Generated QR code image (PNG)
- `submitted_at`: Auto timestamp
- `created_by`: FK to User (optional)

#### User Model (Extended)
- Added `is_office_admin` boolean field to identify office administrators

### 2. API Endpoints

#### Create Appointment (Public)
```
POST /api/appointments/
Content-Type: application/json

{
    "user_name": "John Doe",
    "citizenship_number": "123-45-67890",
    "province": "bagmati",
    "district": "Kathmandu",
    "city": "Kathmandu",
    "office": "kathmandu"
}

Response (201):
{
    "id": 1,
    "user_name": "John Doe",
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

#### List All Appointments (Admin Only)
```
GET /api/appointments/list_all/
Authorization: Bearer <token>

Query Parameters:
- office: Filter by office (optional)
- start_date: Filter by start date (optional)
- end_date: Filter by end date (optional)

Response (200): Array of appointments
```

#### Get QR Code
```
GET /api/appointments/<id>/get_qr_code/

Response (200):
{
    "id": 1,
    "qr_code_url": "http://localhost:8000/media/qr_codes/qr_123-45-67890.png"
}
```

### 3. QR Code Details

The QR code contains the following appointment information in JSON format:
```json
{
    "id": 1,
    "user_name": "John Doe",
    "citizenship_number": "123-45-67890",
    "province": "bagmati",
    "district": "Kathmandu",
    "city": "Kathmandu",
    "office": "kathmandu",
    "submitted_at": "2024-02-23T10:30:00Z"
}
```

---

## Frontend Implementation

### 1. Appointment Form Page
**URL**: `/api/appointments/form/`

Features:
- Responsive form with validation
- Real-time field validation on blur
- Error message display
- Input sanitization
- QR code display after submission
- "Book Another Appointment" button

Form Fields Validation:
- `user_name`: Min 2 characters
- `citizenship_number`: Min 5 characters
- `province`: Required selection
- `district`: Min 2 characters
- `city`: Min 2 characters
- `office`: Required selection

### 2. Admin Dashboard Page
**URL**: `/api/appointments/admin/dashboard/`

Features:
- Requires authentication and `is_office_admin` role
- Responsive table with all appointment details
- Filter by office
- Filter by date (from date)
- View QR codes in modal
- Download QR codes
- Real-time data loading
- XSS protection

---

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Update Django Settings
The following have been configured:
- Added `appointments` to `INSTALLED_APPS`
- Configured `MEDIA_URL` and `MEDIA_ROOT` for file uploads
- Already configured for Django REST Framework

### 3. Database Migration
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Admin User
```bash
python manage.py createsuperuser

# Then in Django Admin, set is_office_admin = True for admin users
```

### 5. Run Development Server
```bash
python manage.py runserver
```

---

## API Usage Examples

### JavaScript Fetch Examples

#### 1. Submit Appointment (Public)
```javascript
const appointmentData = {
    user_name: "John Doe",
    citizenship_number: "123-45-67890",
    province: "bagmati",
    district: "Kathmandu",
    city: "Kathmandu",
    office: "kathmandu"
};

fetch('http://localhost:8000/api/appointments/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData)
})
.then(response => response.json())
.then(data => {
    console.log('QR Code URL:', data.qr_code_url);
    // Display QR code
    const img = document.getElementById('qrCode');
    img.src = data.qr_code_url;
})
.catch(error => console.error('Error:', error));
```

#### 2. Fetch All Appointments (Admin)
```javascript
const token = localStorage.getItem('token'); // JWT token

fetch('http://localhost:8000/api/appointments/list_all/', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
})
.then(response => response.json())
.then(appointments => {
    console.log('All Appointments:', appointments);
    // Render table with appointments
})
.catch(error => console.error('Error:', error));
```

#### 3. Apply Filters
```javascript
const queryParams = new URLSearchParams({
    office: 'kathmandu',
    start_date: '2024-02-01'
});

fetch(`http://localhost:8000/api/appointments/list_all/?${queryParams}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
})
.then(response => response.json())
.then(data => console.log('Filtered appointments:', data))
.catch(error => console.error('Error:', error));
```

---

## Security Features

1. **CORS Protection**: Configured in Django settings
2. **Input Validation**: Both frontend and backend validation
3. **XSS Prevention**: HTML escaping on frontend
4. **Authentication**: JWT-based for admin endpoints
5. **Authorization**: Role-based access control (is_office_admin)
6. **CSRF Protection**: Django CSRF middleware

---

## Frontend Configuration

Update the API base URL in JavaScript files if deployed to different server:

**appointment-form.js** (Line 2):
```javascript
const API_BASE_URL = 'http://your-domain:8000/api/appointments';
```

**admin-dashboard.js** (Line 2):
```javascript
const API_BASE_URL = 'http://your-domain:8000/api/appointments';
```

---

## Testing Workflow

### 1. Test Appointment Form
1. Navigate to: `http://localhost:8000/api/appointments/form/`
2. Fill in the form with test data
3. Submit the form
4. Verify QR code appears
5. Scan QR code to verify content

### 2. Test Admin Dashboard
1. Login with admin credentials
2. Navigate to: `http://localhost:8000/api/appointments/admin/dashboard/`
3. Verify all appointments are displayed
4. Test filters (office, date)
5. Click "View QR" to display QR code modal
6. Download QR code

### 3. Test API Endpoints
```bash
# Create appointment
curl -X POST http://localhost:8000/api/appointments/ \
  -H "Content-Type: application/json" \
  -d '{"user_name":"John","citizenship_number":"123-45-67890","province":"bagmati","district":"Kathmandu","city":"Kathmandu","office":"kathmandu"}'

# List appointments (requires token)
curl -X GET http://localhost:8000/api/appointments/list_all/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get QR code
curl -X GET http://localhost:8000/api/appointments/1/get_qr_code/
```

---

## Troubleshooting

### 1. QR Code Not Generating
- Ensure `Pillow` and `qrcode` packages are installed
- Check media folder permissions
- Verify `MEDIA_ROOT` is writable

### 2. Admin Dashboard Shows 403 Error
- Ensure user is logged in
- Verify `is_office_admin` is set to `True` for the user
- Check JWT token validity

### 3. Required Fields Error
- Ensure all required fields are populated
- Check field lengths meet minimum requirements
- Verify citizenship number is unique

### 4. CORS Error
- Check CORS settings in Django settings
- Verify frontend URL is in allowed origins
- For development: `CORS_ALLOW_ALL_ORIGINS = True`

---

## Performance Optimization

1. **Database Queries**: Use select_related() for FK relationships
2. **Image Optimization**: QR codes are PNG format (small file size)
3. **Caching**: Can implement Redis for admin dashboard
4. **Pagination**: Can add pagination to appointment listing

---

## Future Enhancements

1. Email notifications on appointment submission
2. SMS notifications for confirmations
3. Appointment status tracking (pending, confirmed, completed)
4. Payment integration
5. Calendar integration for appointment scheduling
6. Export appointments to PDF/Excel
7. Multi-language support
8. Advanced analytics dashboard

---

## File Locations Reference

- Models: `backend/appointments/models.py`
- Serializers: `backend/appointments/serializers.py`
- Views: `backend/appointments/views.py`
- URLs: `backend/appointments/urls.py`
- Templates: `backend/appointments/templates/`
- Static Files: `backend/appointments/static/`
- QR Service: `backend/appointments/services/qr_service.py`

---

## Support

For issues or questions, refer to:
1. Django Documentation: https://docs.djangoproject.com/
2. Django REST Framework: https://www.django-rest-framework.org/
3. QRCode Library: https://github.com/lincolnloop/python-qrcode

