from django.db import models

class Service(models.Model):
	name = models.CharField(max_length=255, unique=True)
	description = models.TextField()
	official_links = models.JSONField(default=list, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name
