"""
services/extractors.py for document_scanner app
Implements field extraction for different document types using regex.
"""
import re

def extract_citizenship_data(text):
    """Extracts fields from Nepali citizenship certificate text."""
    data = {}
    # Example regex patterns (adjust as per real document samples)
    name_match = re.search(r"Name[:\s]+([A-Za-z .]+)", text)
    dob_match = re.search(r"Date of Birth[:\s]+([0-9\-/]+)", text)
    number_match = re.search(r"Citizenship No[:\s]+([A-Za-z0-9-]+)", text)
    if name_match:
        data['name'] = name_match.group(1).strip()
    if dob_match:
        data['date_of_birth'] = dob_match.group(1).strip()
    if number_match:
        data['citizenship_number'] = number_match.group(1).strip()
    return data

def extract_passport_data(text):
    """Extracts fields from Nepali passport text."""
    data = {}
    passport_no = re.search(r"Passport No[:\s]+([A-Z0-9]+)", text)
    name = re.search(r"Name[:\s]+([A-Za-z .]+)", text)
    nationality = re.search(r"Nationality[:\s]+([A-Za-z ]+)", text)
    expiry = re.search(r"Date of Expiry[:\s]+([0-9\-/]+)", text)
    if passport_no:
        data['passport_number'] = passport_no.group(1).strip()
    if name:
        data['name'] = name.group(1).strip()
    if nationality:
        data['nationality'] = nationality.group(1).strip()
    if expiry:
        data['expiry_date'] = expiry.group(1).strip()
    return data

def extract_nid_data(text):
    """Extracts fields from Nepali National ID (NID) text."""
    data = {}
    nid_no = re.search(r"NID[:\s]+([0-9]+)", text)
    name = re.search(r"Name[:\s]+([A-Za-z .]+)", text)
    dob = re.search(r"Date of Birth[:\s]+([0-9\-/]+)", text)
    if nid_no:
        data['nid_number'] = nid_no.group(1).strip()
    if name:
        data['name'] = name.group(1).strip()
    if dob:
        data['date_of_birth'] = dob.group(1).strip()
    return data

def extract_birth_certificate_data(text):
    """Extracts fields from Nepali birth certificate text."""
    data = {}
    name = re.search(r"Name[:\s]+([A-Za-z .]+)", text)
    dob = re.search(r"Date of Birth[:\s]+([0-9\-/]+)", text)
    reg_no = re.search(r"Registration No[:\s]+([A-Za-z0-9-]+)", text)
    if name:
        data['name'] = name.group(1).strip()
    if dob:
        data['date_of_birth'] = dob.group(1).strip()
    if reg_no:
        data['registration_number'] = reg_no.group(1).strip()
    return data
