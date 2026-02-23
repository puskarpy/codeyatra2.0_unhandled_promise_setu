# Appointment Booking System - API Reference

## Base URL
```
http://localhost:8000/api/appointments
```

---

## Authentication

### Authentication Methods
1. **Public Endpoints:** No authentication required
2. **Admin Endpoints:** JWT Bearer Token required

### Getting JWT Token
Typically obtained from the user authentication endpoint:
```bash
curl -X POST http://localhost:8000/api/user/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

Response:
```json
{
    "refresh": "eyJ0...",
    "access": "eyJ0..."
}
```

Use the `access` token in requests:
```bash
curl -X GET http://localhost:8000/api/appointments/list_all/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Endpoints

### 1. Create Appointment
**Create a new appointment with automatic QR code generation**

**Endpoint:** `POST /`

**Authentication:** Not required (Public)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
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

**Request Validation:**
| Field | Required | Type | Validation |
|-------|----------|------|-----------|
| user_name | Yes | String | Min 2 characters |
| citizenship_number | Yes | String | Min 5 characters, Unique |
| province | Yes | String | One of: bagmati, gandaki, karnali, koshi, madhesh, rasuwa |
| district | Yes | String | Min 2 characters |
| city | Yes | String | Min 2 characters |
| office | Yes | String | One of: kathmandu, pokhara, dharan, biratnagar, butwal, birgunj |

**Response (201 Created):**
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

**Error Response (400 Bad Request):**
```json
{
    "user_name": ["User name must be at least 2 characters long."],
    "citizenship_number": ["An appointment with this citizenship number already exists."]
}
```

**cURL Example:**
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

**JavaScript Example:**
```javascript
const appointmentData = {
    user_name: "Ramesh Kumar",
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
    console.log('Appointment ID:', data.id);
    console.log('QR Code URL:', data.qr_code_url);
    // Display QR code image
    document.getElementById('qrCode').src = data.qr_code_url;
})
.catch(error => console.error('Error:', error));
```

---

### 2. List All Appointments
**Retrieve all appointments with optional filtering (Admin only)**

**Endpoint:** `GET /list_all/`

**Authentication:** Required (JWT Token)

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| office | String | Filter by office | office=kathmandu |
| start_date | Date | Filter from date (YYYY-MM-DD) | start_date=2024-02-01 |
| end_date | Date | Filter to date (YYYY-MM-DD) | end_date=2024-02-28 |

**Request Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Response (200 OK):**
```json
[
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
    },
    {
        "id": 2,
        "user_name": "Priya Singh",
        "citizenship_number": "456-78-90123",
        "province": "gandaki",
        "district": "Kaski",
        "city": "Pokhara",
        "office": "pokhara",
        "qr_code": "/media/qr_codes/qr_456-78-90123.png",
        "qr_code_url": "http://localhost:8000/media/qr_codes/qr_456-78-90123.png",
        "submitted_at": "2024-02-23T11:00:00Z"
    }
]
```

**Error Response (403 Forbidden):**
```json
{
    "detail": "Only admin users can view all appointments."
}
```

**cURL Examples:**

Basic:
```bash
curl -X GET http://localhost:8000/api/appointments/list_all/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

With filters:
```bash
curl -X GET "http://localhost:8000/api/appointments/list_all/?office=kathmandu&start_date=2024-02-01" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**JavaScript Example:**
```javascript
const token = localStorage.getItem('access_token');

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
.then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
})
.then(data => {
    console.log('Appointments:', data);
    // Render table with appointments
})
.catch(error => console.error('Error:', error));
```

---

### 3. Get QR Code
**Retrieve QR code for a specific appointment**

**Endpoint:** `GET /<id>/get_qr_code/`

**Authentication:** Not required (Public)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Appointment ID |

**Response (200 OK):**
```json
{
    "id": 1,
    "qr_code_url": "http://localhost:8000/media/qr_codes/qr_123-45-67890.png"
}
```

**Error Response (404 Not Found):**
```json
{
    "detail": "QR code not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/appointments/1/get_qr_code/
```

**JavaScript Example:**
```javascript
fetch('http://localhost:8000/api/appointments/1/get_qr_code/')
    .then(response => response.json())
    .then(data => {
        console.log('QR Code URL:', data.qr_code_url);
        // Display or download QR code
        const img = document.getElementById('qrCode');
        img.src = data.qr_code_url;
    })
    .catch(error => console.error('Error:', error));
```

---

### 4. Retrieve Single Appointment
**Get details of a specific appointment**

**Endpoint:** `GET /<id>/`

**Authentication:** Not required (Public)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Appointment ID |

**Response (200 OK):**
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

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/appointments/1/
```

---

### 5. List Appointment (Form Page)
**Serve appointment booking form HTML page**

**Endpoint**: `GET /form/`

**Authentication:** Not required

**Response:** HTML form page

**Browser Access:**
```
http://localhost:8000/api/appointments/form/
```

---

### 6. Admin Dashboard (Page)
**Serve admin dashboard HTML page**

**Endpoint:** `GET /admin/dashboard/`

**Authentication:** Required (Session or JWT)

**Response:** HTML dashboard page with table

**Browser Access:**
```
http://localhost:8000/api/appointments/admin/dashboard/
```

---

## Response Status Codes

| Status | Meaning | When |
|--------|---------|------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST - appointment created |
| 400 | Bad Request | Invalid input data |
| 403 | Forbidden | Admin-only endpoint, user not authorized |
| 404 | Not Found | Appointment ID doesn't exist |
| 500 | Server Error | Unexpected server error |

---

## QR Code Content

When a QR code is scanned, it contains appointment data as JSON:

```json
{
    "id": 1,
    "user_name": "Ramesh Kumar",
    "citizenship_number": "123-45-67890",
    "province": "bagmati",
    "district": "Kathmandu",
    "city": "Kathmandu",
    "office": "kathmandu",
    "submitted_at": "2024-02-23T10:30:00Z"
}
```

---

## Rate Limiting

Currently no rate limiting is configured. In production, consider adding:
- DRF Throttling
- Redis-based rate limiting
- API key authentication

---

## Error Handling

### Common Error Responses

**Validation Error:**
```json
{
    "citizenship_number": [
        "An appointment with this citizenship number already exists."
    ]
}
```

**Not Found:**
```json
{
    "detail": "Not found."
}
```

**Unauthorized:**
```json
{
    "detail": "Authentication credentials were not provided."
}
```

**Forbidden:**
```json
{
    "detail": "Only admin users can view all appointments."
}
```

---

## Data Models

### Appointment Object
```
{
    id: Integer,
    user_name: String (1-255 chars),
    citizenship_number: String (unique),
    province: String (choice),
    district: String (1-100 chars),
    city: String (1-100 chars),
    office: String (choice),
    qr_code: String (file path),
    qr_code_url: String (full URL),
    submitted_at: DateTime (ISO 8601),
    created_by: Integer (FK to User, nullable)
}
```

### Province Choices
- bagmati
- gandaki
- karnali
- koshi
- madhesh
- rasuwa

### Office Choices
- kathmandu (Kathmandu Office)
- pokhara (Pokhara Office)
- dharan (Dharan Office)
- biratnagar (Biratnagar Office)
- butwal (Butwal Office)
- birgunj (Birgunj Office)

---

## Best Practices

### 1. Frontend Submission
```javascript
// Always validate before sending
const isValid = validateForm(data);
if (!isValid) return;

// Provide user feedback
showLoadingState();

// Handle errors gracefully
.catch(error => {
    handleError(error);
    showErrorMessage(error.message);
})
.finally(() => hideLoadingState());
```

### 2. Error Handling
```javascript
fetch(url)
    .then(response => {
        if (!response.ok) {
            const status = response.status;
            if (status === 400) {
                return response.json().then(data => {
                    throw new Error(Object.values(data)[0][0]);
                });
            }
            throw new Error(`HTTP error! status: ${status}`);
        }
        return response.json();
    })
```

### 3. Token Management
```javascript
// Store token securely (not in localStorage for production)
const token = localStorage.getItem('access_token');

// Check token expiration
function isTokenExpired(token) {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp * 1000 < Date.now();
}

// Refresh token if expired
if (isTokenExpired(token)) {
    // Call refresh endpoint
}
```

### 4. CORS Handling
Development:
```javascript
// CORS already handled in backend settings
```

Production:
```javascript
// Configure CORS properly in Django settings
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

---

## Testing with Different Tools

### Postman
1. Create new collection
2. Add requests for each endpoint
3. Set Authorization header for protected endpoints
4. Use environment variables for base URL

### Insomnia
Similar workflow to Postman with built-in GraphQL support if needed

### Thunder Client (VS Code)
Lightweight alternative built into VS Code

### Command Line (curl)
See curl examples throughout this document

---

## Performance Notes

- QR code generation adds ~200-500ms per request
- Consider caching QR codes if needed for high traffic
- Database queries are optimized with select_related
- Pagination can be added for large appointment lists

---

## Future API Enhancements

1. **Batch Operations:**
   - DELETE multiple appointments
   - Update multiple statuses

2. **Search:**
   - Full-text search on names/numbers
   - Advanced filtering

3. **Export:**
   - Generate PDF/Excel exports
   - Email reports

4. **Webhooks:**
   - Notify external systems on appointment creation
   - Status change callbacks

5. **Mobile API:**
   - Dedicated mobile endpoints
   - Pagination support
   - Cache headers

---

## Support

For API issues:
1. Check error messages carefully
2. Review this documentation
3. Check Django admin for data verification
4. Review server logs
5. Test with curl first before debugging frontend code

