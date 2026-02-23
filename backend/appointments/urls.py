from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, AppointmentFormView, AdminDashboardView

router = DefaultRouter()
router.register(r'', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
    path('form/', AppointmentFormView.as_view(), name='appointment_form'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
]
