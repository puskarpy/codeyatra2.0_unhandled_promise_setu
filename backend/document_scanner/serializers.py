"""
serializers.py for document_scanner app
Serializes UploadedDocument model for API usage.
"""
from rest_framework import serializers
from .models import UploadedDocument

class UploadedDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedDocument
        fields = ['id', 'user', 'file', 'document_type', 'extracted_text', 'extracted_data', 'created_at']
        read_only_fields = ['id', 'user', 'document_type', 'extracted_text', 'extracted_data', 'created_at']
