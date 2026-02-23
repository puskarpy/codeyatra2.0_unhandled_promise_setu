"""
views.py for document_scanner app
Implements the document scanning API endpoint.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.files.storage import default_storage
from django.conf import settings
from .models import UploadedDocument
from .serializers import UploadedDocumentSerializer
from .services.ocr import extract_text_from_image
from .services.parsers import (
    parse_citizenship,
    parse_passport,
    parse_pan,
    parse_driving_license
)
import os

class DocumentScanView(APIView):
    """
    API endpoint for scanning documents. Accepts file upload and document_type, runs OCR, parses fields, returns structured JSON.
    """
    permission_classes = []

    def get(self, request, *args, **kwargs):
        """
        GET endpoint for /api/documents/scan/.
        Returns usage information or a simple message.
        """
        return Response({
            'detail': 'Use POST to scan a document. Send file and document_type.'
        }, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        document_type = request.data.get('document_type')
        if not file or not document_type:
            return Response({'detail': 'File and document_type are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save file temporarily
        file_path = default_storage.save(f"documents/{file.name}", file)
        abs_path = os.path.join(settings.MEDIA_ROOT, file_path)

        try:
            # Use Google Vision OCR
            text = extract_text_from_image(abs_path)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        # Log OCR text and document_type for debugging
        print("OCR TEXT:\n", text)
        print("DOCUMENT TYPE:", document_type)

        # Call parser based on document_type
        extracted_data = {}
        if document_type == 'passport':
            extracted_data = parse_passport(text)
            print("PARSED DATA:", extracted_data)
        elif document_type == 'citizenship':
            extracted_data = parse_citizenship(text)
            print("PARSED DATA:", extracted_data)
        elif document_type == 'pan':
            extracted_data = parse_pan(text)
            print("PARSED DATA:", extracted_data)
        elif document_type == 'driving_license':
            extracted_data = parse_driving_license(text)
        else:
            return Response({'detail': 'Invalid document_type.'}, status=status.HTTP_400_BAD_REQUEST)

        # Always return document_type and extracted_data
        response = {
            'status': 'success',
            'document_type': document_type,
            'extracted_data': extracted_data or {}
        }

        # Save scan result to a .json file
        import json
        json_filename = os.path.splitext(os.path.basename(file.name))[0] + "_scan.json"
        documents_dir = os.path.join(settings.BASE_DIR, "documents")
        os.makedirs(documents_dir, exist_ok=True)
        json_path = os.path.join(documents_dir, json_filename)
        with open(json_path, "w", encoding="utf-8") as jf:
            json.dump(response, jf, ensure_ascii=False, indent=2)

        return Response(response, status=status.HTTP_200_OK)
