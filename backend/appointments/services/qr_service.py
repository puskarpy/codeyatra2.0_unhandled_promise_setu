import json
import qrcode
from qrcode import constants
from io import BytesIO
from django.core.files.base import ContentFile


def generate_qr_code(appointment):
    """
    Generate QR code for appointment containing all appointment info
    """
    # Prepare appointment data as JSON
    appointment_data = {
        'id': appointment.id,
        'user_name': appointment.user_name,
        'citizenship_number': appointment.citizenship_number,
        'province': appointment.province,
        'district': appointment.district,
        'city': appointment.city,
        'office': appointment.office,
        'submitted_at': appointment.submitted_at.isoformat(),
    }
    
    # Convert to JSON string
    qr_data = json.dumps(appointment_data)
    
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Create image from QR code
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Save to file
    qr_file = BytesIO()
    qr_image.save(qr_file, 'PNG')
    qr_file.seek(0)
    
    # Save to appointment model
    filename = f'qr_{appointment.citizenship_number}.png'
    appointment.qr_code.save(filename, ContentFile(qr_file.read()), save=True)
    
    return appointment
