from django.contrib import admin
from .models import FormTemplate, Question, FormSubmission, Answer

@admin.register(FormTemplate)
class FormTemplateAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'service', 'created_at', 'updated_at')
	search_fields = ('name',)
	list_filter = ('service',)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
	list_display = ('id', 'form_template', 'text', 'question_type', 'required', 'order')
	search_fields = ('text',)
	list_filter = ('question_type', 'required')

@admin.register(FormSubmission)
class FormSubmissionAdmin(admin.ModelAdmin):
	list_display = ('id', 'form_template', 'user', 'submitted_at', 'status')
	search_fields = ('user__phone',)
	list_filter = ('status',)

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
	list_display = ('id', 'submission', 'question', 'value', 'file')
	search_fields = ('value',)
