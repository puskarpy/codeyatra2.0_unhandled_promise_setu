from django.urls import path
<<<<<<< HEAD
from .views import RegisterUserView, UserListView, UserDetailView, PhoneLoginView, SendOTPView, VerifyOTPView, ProfileView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', PhoneLoginView.as_view(), name='phone_login'),
    path('send-otp/', SendOTPView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
    path('profile/', ProfileView.as_view()),
]
=======
from .views import RegisterView, LoginView, RequestOTPView, VerifyOTPView, UserInfoView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('me/', UserInfoView.as_view(), name='user-info'),
]
>>>>>>> origin/sujan
