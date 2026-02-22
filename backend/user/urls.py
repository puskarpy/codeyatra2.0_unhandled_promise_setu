from django.urls import path
from .views import RegisterView, LoginView, RequestOTPView, VerifyOTPView, UserInfoView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('me/', UserInfoView.as_view(), name='user-info'),
]
