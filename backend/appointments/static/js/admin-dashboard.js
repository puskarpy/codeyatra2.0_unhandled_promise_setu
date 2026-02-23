// Configuration
const API_BASE_URL = 'http://localhost:8000/api/appointments';
const LOGIN_URL = 'http://localhost:8000/api/user/login/';

// DOM Elements
const loginModal = document.getElementById('loginModal');
const dashboardContent = document.getElementById('dashboardContent');
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

const appointmentsTableBody = document.getElementById('appointmentsTableBody');
const loadingSpinner = document.getElementById('loadingSpinner');
const filterBtn = document.getElementById('filterBtn');
const clearFilterBtn = document.getElementById('clearFilterBtn');
const filterOffice = document.getElementById('filterOffice');
const filterDate = document.getElementById('filterDate');
const logoutBtn = document.getElementById('logoutBtn');
const qrCodeModal = document.getElementById('qrCodeModal');
const modalQrCode = document.getElementById('modalQrCode');
const modalCloseBtn = document.querySelector('.close');
const downloadQrBtn = document.getElementById('downloadQrBtn');

// Storage for appointments data
let allAppointments = [];
let filteredAppointments = [];

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token') || localStorage.getItem('access_token');
}

// Event Listeners
loginBtn.addEventListener('click', handleLogin);
filterBtn.addEventListener('click', applyFilters);
clearFilterBtn.addEventListener('click', clearFilters);
logoutBtn.addEventListener('click', handleLogout);
modalCloseBtn.addEventListener('click', closeModal);
qrCodeModal.addEventListener('click', (e) => {
    if (e.target == qrCodeModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Allow login with Enter key
loginPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLogin();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const token = getToken();
    if (token) {
        showDashboard();
        loadAppointments();
    }
});

/**
 * Handle admin login
 */
async function handleLogin() {
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();
    
    if (!email || !password) {
        loginError.textContent = 'Please enter email and password';
        loginError.style.display = 'block';
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    loginError.style.display = 'none';

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
        }

        const data = await response.json();
        
        // Check if user is admin
        if (!data.user || !data.user.is_office_admin) {
            throw new Error('Only admin users can access this dashboard');
        }

        // Store token
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
            localStorage.setItem('refresh_token', data.refresh);
        }

        // Show dashboard
        showDashboard();
        loadAppointments();

    } catch (error) {
        loginError.textContent = error.message || 'Login failed';
        loginError.style.display = 'block';
        console.error('Login error:', error);
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
}

/**
 * Show dashboard and hide login
 */
function showDashboard() {
    loginModal.style.display = 'none';
    dashboardContent.style.display = 'block';
}

/**
 * Load appointments from API
 */
async function loadAppointments() {
    try {
        loadingSpinner.style.display = 'block';
        appointmentsTableBody.innerHTML = '<tr><td colspan="9">Loading...</td></tr>';

        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/list_all/`, {
            method: 'GET',
            headers: headers,
        });

        if (response.status === 403) {
            throw new Error('Access denied. Only admin users can view appointments.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to load appointments (${response.status})`);
        }

        allAppointments = await response.json();
        filteredAppointments = allAppointments;
        displayAppointments(filteredAppointments);

    } catch (error) {
        appointmentsTableBody.innerHTML = `<tr><td colspan="9" class="no-data" style="color: red;">Error: ${error.message}</td></tr>`;
        console.error('Error:', error);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

/**
 * Display appointments in table
 */
function displayAppointments(appointments) {
    if (appointments.length === 0) {
        appointmentsTableBody.innerHTML = '<tr><td colspan="9" class="no-data">No appointments found</td></tr>';
        return;
    }

    appointmentsTableBody.innerHTML = appointments.map((appointment, index) => {
        const submittedAt = new Date(appointment.submitted_at).toLocaleString();
        return `
            <tr>
                <td>${appointment.id}</td>
                <td>${escapeHtml(appointment.user_name)}</td>
                <td>${escapeHtml(appointment.citizenship_number)}</td>
                <td>${escapeHtml(appointment.province)}</td>
                <td>${escapeHtml(appointment.district)}</td>
                <td>${escapeHtml(appointment.city)}</td>
                <td>${escapeHtml(appointment.office)}</td>
                <td>${submittedAt}</td>
                <td>
                    ${appointment.qr_code_url 
                        ? `<button class="qr-btn" onclick="viewQRCode('${escapeHtml(appointment.qr_code_url)}', ${appointment.id})">View QR</button>`
                        : 'N/A'
                    }
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Apply filters
 */
function applyFilters() {
    const office = filterOffice.value;
    const date = filterDate.value;

    filteredAppointments = allAppointments.filter(appointment => {
        let matches = true;

        if (office) {
            matches = matches && appointment.office === office;
        }

        if (date) {
            const appointmentDate = new Date(appointment.submitted_at).toISOString().split('T')[0];
            matches = matches && appointmentDate >= date;
        }

        return matches;
    });

    displayAppointments(filteredAppointments);
}

/**
 * Clear filters
 */
function clearFilters() {
    filterOffice.value = '';
    filterDate.value = '';
    filteredAppointments = allAppointments;
    displayAppointments(filteredAppointments);
}

/**
 * View QR Code
 */
function viewQRCode(qrCodeUrl, appointmentId) {
    modalQrCode.src = qrCodeUrl;
    downloadQrBtn.href = qrCodeUrl;
    downloadQrBtn.download = `appointment_qr_${appointmentId}.png`;
    qrCodeModal.style.display = 'block';
}

/**
 * Close modal
 */
function closeModal() {
    qrCodeModal.style.display = 'none';
}

/**
 * Handle logout
 */
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Clear form and error
    loginEmailInput.value = '';
    loginPasswordInput.value = '';
    loginError.style.display = 'none';
    
    // Show login modal and hide dashboard
    loginModal.style.display = 'flex';
    dashboardContent.style.display = 'none';
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Allow closing modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

console.log('Admin dashboard initialized');
