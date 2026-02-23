"""
services/parsers.py
Document-specific parsing functions for Setu document scanner.
Handles Nepali (Devanagari) and English mixed text.
"""
import re
from datetime import datetime

def parse_citizenship(text):
    """
    Parse Nepali citizenship card text for required fields.
    Returns dict with full_name, dob, citizenship_number, district.
    """
    data = {}
    # Nepali and English keywords
    name_patterns = [r"नाम[:\s]+([\u0900-\u097F A-Za-z.]+)", r"Name[:\s]+([A-Za-z .]+)"]
    dob_patterns = [r"जन्म मिति[:\s]+([\d\-/०१२३४५६७८९]+)", r"Date of Birth[:\s]+([\d\-/]+)"]
    number_patterns = [r"नागरिकता नं[:\s]+([\w\d\-/]+)", r"Citizenship No[:\s]+([A-Za-z0-9-]+)"]
    district_patterns = [r"जिल्ला[:\s]+([\u0900-\u097F A-Za-z.]+)", r"District[:\s]+([A-Za-z .]+)"]

    def search_patterns(patterns):
        for pat in patterns:
            m = re.search(pat, text)
            if m:
                return m.group(1).strip()
        return None

    data['full_name'] = search_patterns(name_patterns)
    data['dob'] = search_patterns(dob_patterns)
    data['citizenship_number'] = search_patterns(number_patterns)
    data['district'] = search_patterns(district_patterns)

    # Basic validation
    if data['dob']:
        # Try to normalize Nepali/English numerals and date format
        nepali_to_eng = str.maketrans('०१२३४५६७८९', '0123456789')
        dob = data['dob'].translate(nepali_to_eng)
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%Y/%m/%d"):
            try:
                data['dob'] = datetime.strptime(dob, fmt).strftime("%Y-%m-%d")
                break
            except Exception:
                continue
    return data

def parse_passport(text):
    import re
    from datetime import datetime

    def clean(val):
        if val is None:
            return None
        return val.replace('<', ' ').replace('\n', ' ').strip() or None

    def parse_date(val):
        if not val or not isinstance(val, str):
            return None
        val = val.strip()
        # YYMMDD
        m1 = re.match(r'^(\d{2})(\d{2})(\d{2})$', val)
        if m1:
            yy, mm, dd = m1.groups()
            year = int(yy)
            if year < 30:
                year += 2000
            else:
                year += 1900
            try:
                return datetime(year, int(mm), int(dd)).strftime('%Y-%m-%d')
            except Exception:
                return None
        # 13 OCT 2005
        m2 = re.match(r'^(\d{1,2})\s*([A-Z]{3,})\s*(\d{2,4})$', val, re.I)
        if m2:
            day, mon, year = m2.groups()
            try:
                dt = datetime.strptime(f"{day} {mon} {year}", "%d %b %Y")
                return dt.strftime('%Y-%m-%d')
            except Exception:
                try:
                    dt = datetime.strptime(f"{day} {mon} {year}", "%d %B %Y")
                    return dt.strftime('%Y-%m-%d')
                except Exception:
                    return None
        return None

    # Defensive line splitting
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    # MRZ detection
    mrz_lines = [l for l in lines if l.count('<') > 5 and len(l) >= 20 and re.match(r'^[A-Z0-9<]{20,}$', l)]
    mrz_data = {}
    if len(mrz_lines) >= 2:
        mrz1, mrz2 = mrz_lines[-2], mrz_lines[-1]
        try:
            mrz1 = mrz1[:44]
            mrz2 = mrz2[:44]
            mrz_data["country_code"] = clean(mrz1[2:5]) if re.match(r'^[A-Z]{3}$', mrz1[2:5]) else None
            names = mrz1[5:].split('<<')
            mrz_data["surname"] = clean(names[0]) if names else None
            mrz_data["given_names"] = clean(names[1]) if len(names) > 1 else None
            mrz_data["passport_number"] = clean(mrz2[0:9]) if re.match(r'\b[A-Z]{1,2}\d{6,8}\b', mrz2[0:9]) else None
            mrz_data["nationality"] = clean(mrz2[10:13]) if mrz2[10:13].isalpha() and len(mrz2[10:13]) == 3 else None
            mrz_data["date_of_birth"] = parse_date(mrz2[13:19])
            mrz_data["sex"] = mrz2[20] if mrz2[20] in ['M', 'F'] else None
            mrz_data["date_of_expiry"] = parse_date(mrz2[21:27])
            personal_number = mrz2[28:42]
            mrz_data["personal_number"] = personal_number if personal_number.isdigit() else None
        except Exception:
            pass

    # Label-based extraction (only next meaningful line)
    label_map = {
        "surname": ["SURNAME"],
        "given_names": ["GIVEN NAMES", "GIVEN NAME"],
        "passport_number": ["PASSPORT NO", "PASSPORT NUMBER"],
        "nationality": ["NATIONALITY"],
        "date_of_birth": ["DATE OF BIRTH", "DOB"],
        "date_of_issue": ["DATE OF ISSUE"],
        "date_of_expiry": ["DATE OF EXPIRY"],
        "place_of_birth": ["PLACE OF BIRTH"],
        "issuing_authority": ["ISSUING AUTHORITY", "AUTHORITY"],
        "personal_number": ["PERSONAL NO", "PERSONAL NUMBER"],
        "sex": ["SEX"],
        "country_code": ["COUNTRY CODE"]
    }
    label_data = {}
    for idx, line in enumerate(lines):
        for field, labels in label_map.items():
            for label in labels:
                if line.upper().startswith(label):
                    # Only take the next meaningful line
                    next_val = None
                    for j in range(idx+1, len(lines)):
                        candidate = lines[j]
                        if candidate and not any(candidate.upper().startswith(l) for l in sum(label_map.values(), [])):
                            next_val = candidate
                            break
                    if next_val:
                        if 'date' in field:
                            label_data[field] = parse_date(next_val)
                        elif field == 'sex':
                            label_data[field] = next_val if next_val in ['M', 'F'] else None
                        elif field == 'country_code':
                            label_data[field] = next_val if re.match(r'^[A-Z]{3}$', next_val) else None
                        elif field == 'passport_number':
                            label_data[field] = next_val if re.match(r'\b[A-Z]{1,2}\d{6,8}\b', next_val) else None
                        elif field == 'personal_number':
                            label_data[field] = next_val if next_val.isdigit() else None
                        else:
                            label_data[field] = clean(next_val)

    # Defensive merge: prefer MRZ, fallback to label
    result = {
        "document_type": "passport",
        "passport_number": mrz_data.get("passport_number") or label_data.get("passport_number") or None,
        "surname": mrz_data.get("surname") or label_data.get("surname") or None,
        "given_names": mrz_data.get("given_names") or label_data.get("given_names") or None,
        "nationality": mrz_data.get("nationality") or label_data.get("nationality") or None,
        "date_of_birth": mrz_data.get("date_of_birth") or label_data.get("date_of_birth") or None,
        "date_of_issue": label_data.get("date_of_issue") or None,
        "date_of_expiry": mrz_data.get("date_of_expiry") or label_data.get("date_of_expiry") or None,
        "sex": mrz_data.get("sex") or label_data.get("sex") or None,
        "place_of_birth": label_data.get("place_of_birth") or None,
        "issuing_authority": label_data.get("issuing_authority") or None,
        "personal_number": mrz_data.get("personal_number") or label_data.get("personal_number") or None,
        "country_code": mrz_data.get("country_code") or label_data.get("country_code") or None
    }
    # Defensive: never return None or {}
    if not any(result.values()):
        result["document_type"] = "passport"
    return result

def parse_pan(text):
    # Implement similar to above, with PAN-specific fields
    return {}

def parse_driving_license(text):
    # Implement similar to above, with driving license-specific fields
    return {}
