from rest_framework import generics, permissions
from .models import FormTemplate, Question, FormSubmission, Answer
from .serializers import (
	FormTemplateSerializer, QuestionSerializer, FormSubmissionSerializer, AnswerSerializer
)

class FormTemplateListCreateView(generics.ListCreateAPIView):
	queryset = FormTemplate.objects.all()
	serializer_class = FormTemplateSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class FormTemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
	queryset = FormTemplate.objects.all()
	serializer_class = FormTemplateSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class QuestionListCreateView(generics.ListCreateAPIView):
	queryset = Question.objects.all()
	serializer_class = QuestionSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Question.objects.all()
	serializer_class = QuestionSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class FormSubmissionListCreateView(generics.ListCreateAPIView):
	queryset = FormSubmission.objects.all()
	serializer_class = FormSubmissionSerializer
	permission_classes = [permissions.IsAuthenticated]

class FormSubmissionDetailView(generics.RetrieveUpdateDestroyAPIView):
	queryset = FormSubmission.objects.all()
	serializer_class = FormSubmissionSerializer
	permission_classes = [permissions.IsAuthenticated]

class AnswerListCreateView(generics.ListCreateAPIView):
	queryset = Answer.objects.all()
	serializer_class = AnswerSerializer
	permission_classes = [permissions.IsAuthenticated]

class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Answer.objects.all()
	serializer_class = AnswerSerializer
	permission_classes = [permissions.IsAuthenticated]
