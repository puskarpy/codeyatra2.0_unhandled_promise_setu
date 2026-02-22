"""
urls.py for document_scanner app
Defines API endpoint for document scanning.
"""
from django.urls import path
from .views import DocumentScanView

urlpatterns = [
    path('scan/', DocumentScanView.as_view(), name='document-scan'),
]
