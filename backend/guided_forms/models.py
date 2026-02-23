from django.db import models
from services.models import Service
from user.models import User

class FormTemplate(models.Model):
	service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='form_templates')
	name = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"{self.name} ({self.service.name})"

class Question(models.Model):
	form_template = models.ForeignKey(FormTemplate, on_delete=models.CASCADE, related_name='questions')
	text = models.CharField(max_length=1024)
	question_type = models.CharField(max_length=50, choices=[('text', 'Text'), ('number', 'Number'), ('choice', 'Choice'), ('file', 'File')])
	required = models.BooleanField(default=True)
	order = models.PositiveIntegerField(default=0)
	choices = models.JSONField(blank=True, null=True)

	def __str__(self):
		return f"Q: {self.text} ({self.form_template.name})"

class FormSubmission(models.Model):
	id = models.AutoField(primary_key=True)
	form_template = models.ForeignKey(FormTemplate, on_delete=models.CASCADE, related_name='submissions')
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='form_submissions')
	submitted_at = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=50, default='submitted')

	def __str__(self):
		return f"Submission by {self.user.phone} for {self.form_template.name}"

class Answer(models.Model):
	submission = models.ForeignKey(FormSubmission, on_delete=models.CASCADE, related_name='answers')
	question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
	value = models.TextField(blank=True, null=True)
	file = models.FileField(upload_to='form_uploads/', blank=True, null=True)

	def __str__(self):
		return f"Answer to '{self.question.text}' in submission {self.submission.id}"
