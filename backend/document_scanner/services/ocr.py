

"""
services/ocr.py for document_scanner app
Provides OCR utilities for extracting text from images and PDFs, and document type detection, using EasyOCR.
"""
import easyocr
from PIL import Image
from pdf2image import convert_from_path
import cv2
import numpy as np

# Nepali: 'ne', English: 'en'
reader = easyocr.Reader(['en'])

def preprocess_image(path):
    """Preprocess image for OCR: grayscale, binarize, denoise, deskew."""
    img = cv2.imread(path)
    if img is None:
        raise ValueError("Image not found or unreadable.")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Binarization
    _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    # Denoising
    denoised = cv2.fastNlMeansDenoising(thresh, None, 30, 7, 21)
    # Deskew (optional, simple)
    coords = np.column_stack(np.where(denoised > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = denoised.shape
    M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
    deskewed = cv2.warpAffine(denoised, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return deskewed

def extract_text_from_image(path):
    """Extract text from an image file using EasyOCR after preprocessing."""
    try:
        processed = preprocess_image(path)
        temp_path = path + "_processed.png"
        cv2.imwrite(temp_path, processed)
        result = reader.readtext(temp_path)
        text_lines = []
        for item in result:
            if isinstance(item, (list, tuple)) and len(item) > 1 and isinstance(item[1], str):
                text_lines.append(item[1])
            elif isinstance(item, dict) and 'text' in item and isinstance(item['text'], str):
                text_lines.append(item['text'])
        text = '\n'.join(text_lines)
        return text
    except Exception as e:
        raise ValueError(f"Failed to process image: {e}")

def extract_text_from_pdf(path):
    """Extract text from a PDF file by converting each page to image and running OCR with EasyOCR."""
    try:
        images = convert_from_path(path)
        all_text = []
        for i, img in enumerate(images):
            img_path = f"{path}_page_{i}.png"
            img.save(img_path)
            processed = preprocess_image(img_path)
            temp_path = img_path + "_processed.png"
            cv2.imwrite(temp_path, processed)
            result = reader.readtext(temp_path)
            text_lines = []
            for item in result:
                if isinstance(item, (list, tuple)) and len(item) > 1 and isinstance(item[1], str):
                    text_lines.append(item[1])
                elif isinstance(item, dict) and 'text' in item and isinstance(item['text'], str):
                    text_lines.append(item['text'])
            all_text.append('\n'.join(text_lines))
        text = '\n'.join(all_text)
        return text
    except Exception as e:
        raise ValueError(f"Failed to process PDF: {e}")

def detect_document_type(text):
    """Detect document type based on keywords in the text."""
    text_lower = text.lower()
    if "citizenship" in text_lower or "nagrita" in text_lower:
        return "citizenship"
    elif "passport" in text_lower:
        return "passport"
    elif "driving licence" in text_lower or "driving license" in text_lower:
        return "driving_license"
    elif "birth certificate" in text_lower:
        return "birth_certificate"
    elif "national id" in text_lower or "nid" in text_lower:
        return "nid"
    else:
        return "unknown"
