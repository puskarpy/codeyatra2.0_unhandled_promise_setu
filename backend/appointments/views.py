from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404, render
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentCreateSerializer
from .services.qr_service import generate_qr_code


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        return AppointmentSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        """Create a new appointment with QR code generation"""
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create appointment
            appointment = serializer.save()
            
            # Generate QR code
            appointment = generate_qr_code(appointment)
            
            # Return appointment data with QR code
            response_serializer = AppointmentSerializer(appointment, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error creating appointment: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def list_all(self, request):
        """List all appointments (admin only)"""
        if not getattr(request.user, 'is_office_admin', False) and not request.user.is_staff:
            return Response(
                {'detail': 'Only admin users can view all appointments.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        queryset = self.get_queryset()
        
        # Filter by office if provided
        office = request.query_params.get('office')
        if office:
            queryset = queryset.filter(office=office)
        
        # Filter by date if provided
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(submitted_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(submitted_at__lte=end_date)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def get_qr_code(self, request, pk=None):
        """Get QR code for a specific appointment"""
        appointment = self.get_object()
        if appointment.qr_code:
            return Response({
                'id': appointment.id,
                'qr_code_url': request.build_absolute_uri(appointment.qr_code.url)
            })
        return Response(
            {'detail': 'QR code not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

    def list(self, request, *args, **kwargs):
        """Override list to provide appropriate response"""
        if request.user and request.user.is_authenticated:
            if getattr(request.user, 'is_office_admin', False) or request.user.is_staff:
                return self.list_all(request)
        
        return Response(
            {'detail': 'Use /api/appointments/list_all/ for admin view.'}, 
            status=status.HTTP_403_FORBIDDEN
        )