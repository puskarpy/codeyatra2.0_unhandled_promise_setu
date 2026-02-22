from rest_framework import serializers
from .models import FormTemplate, Question, FormSubmission, Answer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'form_template', 'text', 'question_type', 'required', 'order', 'choices']

class FormTemplateSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = FormTemplate
        fields = ['id', 'service', 'name', 'description', 'created_at', 'updated_at', 'questions']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'submission', 'question', 'value', 'file']

class FormSubmissionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    class Meta:
        model = FormSubmission
        fields = ['id', 'form_template', 'user', 'submitted_at', 'status', 'answers']
