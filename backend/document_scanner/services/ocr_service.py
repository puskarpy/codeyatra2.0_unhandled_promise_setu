import os
from django.conf import settings
from google.cloud import vision

# Build the path relative to your project root (where manage.py is)
KEY_FILE_PATH = os.path.join(settings.BASE_DIR, 'service-account-file.json')

# Check if the file actually exists to avoid the "DefaultCredentialsError"
if not os.path.exists(KEY_FILE_PATH):
    raise FileNotFoundError(
        f"GCP JSON key not found at {KEY_FILE_PATH}. "
        f"Please ensure your key is renamed and placed in the project root."
    )

# Explicitly use the JSON file
client = vision.ImageAnnotatorClient.from_service_account_json(
    KEY_FILE_PATH)