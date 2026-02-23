"""
models.py for document_scanner app
Defines UploadedDocument model for storing uploaded documents and extracted data.
"""
from django.db import models
from django.contrib.auth import get_user_model

class UploadedDocument(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="uploaded_documents")
    file = models.FileField(upload_to="documents/")
    document_type = models.CharField(max_length=64)
    extracted_text = models.TextField()
    extracted_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document_type} uploaded by {self.user}"

# New model for citizenship card data
class CitizenshipCard(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="citizenship_cards")
    uploaded_document = models.OneToOneField(UploadedDocument, on_delete=models.CASCADE, related_name="citizenship_card")
    name = models.CharField(max_length=128)
    address = models.CharField(max_length=256)
    citizenship_number = models.CharField(max_length=64)
    district = models.CharField(max_length=64)
    date_of_issue = models.CharField(max_length=64)
    father_name = models.CharField(max_length=128, blank=True, null=True)
    mother_name = models.CharField(max_length=128, blank=True, null=True)
    gender = models.CharField(max_length=16, blank=True, null=True)
    date_of_birth = models.CharField(max_length=64, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CitizenshipCard {self.citizenship_number} for {self.name}"