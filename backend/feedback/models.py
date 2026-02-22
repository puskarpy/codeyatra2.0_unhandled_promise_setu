from django.db import models
from user.models import User
from services.models import Service

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='ratings')
    officer = models.CharField(max_length=255, blank=True, null=True)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.phone} rated {self.service.name} ({self.rating})"