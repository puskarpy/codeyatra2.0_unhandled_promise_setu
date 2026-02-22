from django.urls import path
from .views import (
    FormTemplateListCreateView, FormTemplateDetailView,
    QuestionListCreateView, QuestionDetailView,
    FormSubmissionListCreateView, FormSubmissionDetailView,
    AnswerListCreateView, AnswerDetailView
)

urlpatterns = [
    path('form-templates/', FormTemplateListCreateView.as_view(), name='formtemplate-list-create'),
    path('form-templates/<int:pk>/', FormTemplateDetailView.as_view(), name='formtemplate-detail'),
    path('questions/', QuestionListCreateView.as_view(), name='question-list-create'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),
    path('submissions/', FormSubmissionListCreateView.as_view(), name='submission-list-create'),
    path('submissions/<int:pk>/', FormSubmissionDetailView.as_view(), name='submission-detail'),
    path('answers/', AnswerListCreateView.as_view(), name='answer-list-create'),
    path('answers/<int:pk>/', AnswerDetailView.as_view(), name='answer-detail'),
]
