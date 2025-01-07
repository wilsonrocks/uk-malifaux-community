from django.contrib import admin
from website.models import Team

class TeamAdmin(admin.ModelAdmin):
    exclude = ["captain"]

    def get_queryset(self, request):
        query_set = super().get_queryset(request)
        if request.user.is_superuser:
            return query_set  # Superusers see everything
        return query_set.filter(captain=request.user)

    def save_model(self, request, obj, form, change):
        if not obj.pk:  # Only set created_by on new objects
            obj.captain = request.user
        super().save_model(request, obj, form, change)

admin.site.register(Team, TeamAdmin)
