// Configuration
const API_BASE_URL = 'http://localhost:8000/api/appointments';

// DOM Elements
const appointmentForm = document.getElementById('appointmentForm');
const successContainer = document.getElementById('successContainer');
const qrCodeImage = document.getElementById('qrCodeImage');
const resetBtn = document.getElementById('resetBtn');
const formError = document.getElementById('formError');

// Field elements
const fields = {
    userName: document.getElementById('userName'),
    citizenshipNumber: document.getElementById('citizenshipNumber'),
    province: document.getElementById('province'),
    district: document.getElementById('district'),
    city: document.getElementById('city'),
    office: document.getElementById('office'),
};

// Error elements
const errorElements = {
    userName: document.getElementById('userNameError'),
    citizenshipNumber: document.getElementById('citizenshipNumberError'),
    province: document.getElementById('provinceError'),
    district: document.getElementById('districtError'),
    city: document.getElementById('cityError'),
    office: document.getElementById('officeError'),
};

// Event Listeners
appointmentForm.addEventListener('submit', handleFormSubmit);
resetBtn.addEventListener('click', resetForm);

// Form validation
Object.keys(fields).forEach(fieldName => {
    fields[fieldName].addEventListener('blur', () => {
        validateField(fieldName);
    });
});

/**
 * Validate a single field
 */
function validateField(fieldName) {
    const field = fields[fieldName];
    const error = errorElements[fieldName];
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'userName':
            if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
        case 'citizenshipNumber':
            if (field.value.trim().length < 5) {
                isValid = false;
                errorMessage = 'Invalid citizenship number';
            }
            break;
        case 'province':
            if (!field.value) {
                isValid = false;
                errorMessage = 'Please select a province';
            }
            break;
        case 'district':
            if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'District must be at least 2 characters long';
            }
            break;
        case 'city':
            if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'City must be at least 2 characters long';
            }
            break;
        case 'office':
            if (!field.value) {
                isValid = false;
                errorMessage = 'Please select an office';
            }
            break;
    }

    error.textContent = errorMessage;
    return isValid;
}

/**
 * Validate all form fields
 */
function validateAllFields() {
    let isValid = true;
    Object.keys(fields).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });
    return isValid;
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    formError.textContent = '';

    // Validate all fields
    if (!validateAllFields()) {
        return;
    }

    // Show loading state
    const submitBtn = appointmentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        // Prepare form data
        const formData = {
            user_name: fields.userName.value.trim(),
            citizenship_number: fields.citizenshipNumber.value.trim(),
            province: fields.province.value,
            district: fields.district.value.trim(),
            city: fields.city.value.trim(),
            office: fields.office.value,
        };

        // Send request
        const response = await fetch(`${API_BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to submit appointment');
        }

        const data = await response.json();

        // Hide form and show success message with QR code
        appointmentForm.style.display = 'none';
        successContainer.style.display = 'block';

        // Load QR code image
        if (data.qr_code_url) {
            qrCodeImage.src = data.qr_code_url;
        }

    } catch (error) {
        formError.textContent = error.message || 'An error occurred. Please try again.';
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Reset form and display
 */
function resetForm() {
    appointmentForm.reset();
    appointmentForm.style.display = 'block';
    successContainer.style.display = 'none';
    Object.values(errorElements).forEach(el => el.textContent = '');
    formError.textContent = '';
}

// Initialize form
console.log('Appointment form initialized');
