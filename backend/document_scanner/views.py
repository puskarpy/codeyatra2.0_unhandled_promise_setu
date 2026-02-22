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
from .services.ocr import extract_text_from_image, extract_text_from_pdf, detect_document_type
from .services.extractors import (
    extract_citizenship_data,
    extract_passport_data,
    extract_nid_data,
    extract_birth_certificate_data
)
import os

class DocumentScanView(APIView):
    """
    API endpoint for scanning documents. Accepts file upload, runs OCR, detects type, extracts fields, saves and returns data.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({'detail': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save file temporarily
        file_path = default_storage.save(f"documents/{file.name}", file)
        abs_path = os.path.join(settings.MEDIA_ROOT, file_path)

        try:
            if file.name.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
                text = extract_text_from_image(abs_path)
            elif file.name.lower().endswith('.pdf'):
                text = extract_text_from_pdf(abs_path)
            else:
                return Response({'detail': 'Unsupported file format.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        doc_type = detect_document_type(text)
        if doc_type == 'citizenship':
            data = extract_citizenship_data(text)
        elif doc_type == 'passport':
            data = extract_passport_data(text)
        elif doc_type == 'nid':
            data = extract_nid_data(text)
        elif doc_type == 'birth_certificate':
            data = extract_birth_certificate_data(text)
        else:
            data = {}

        # Save to DB
        uploaded_doc = UploadedDocument.objects.create(
            user=request.user,
            file=file_path,
            document_type=doc_type,
            extracted_text=text,
            extracted_data=data
        )
        serializer = UploadedDocumentSerializer(uploaded_doc)
        return Response({
            'document_type': doc_type,
            'extracted_data': data,
            'id': uploaded_doc.id
        }, status=status.HTTP_201_CREATED)
