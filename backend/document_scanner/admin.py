"""
admin.py for document_scanner app
Registers UploadedDocument model in Django admin.
"""
from django.contrib import admin
from .models import UploadedDocument

@admin.register(UploadedDocument)
class UploadedDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'document_type', 'created_at')
    search_fields = ('user__username', 'document_type')
    list_filter = ('document_type', 'created_at')
