from django.contrib import admin
from .models import Rating

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'service', 'officer', 'rating', 'created_at')
    search_fields = ('user__phone', 'service__name', 'officer')
    list_filter = ('rating', 'service', 'officer')
