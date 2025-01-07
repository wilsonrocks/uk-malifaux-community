from django.contrib import admin
from website.models import  BestPaintedImage, Player, Event

class BestPaintedImageInline(admin.StackedInline):
    # TODO add order and work out how to add up/down buttons
    class Media:
        js = ("/static/website/js/custom_admin.js",)  # Add your custom JavaScript file

    model = BestPaintedImage
    readonly_fields = ["file_preview"]
    extra = 1  # Number of empty forms to display by default
    fields = [
        "image",
        "file_preview",
        "painter",
        "title",
        "is_winner",
    ]


class PlayerInline(admin.TabularInline):
    model = Player


class EventAdmin(admin.ModelAdmin):

    class Media:
        js = ("/static/website/js/custom_admin.js",)  # Add your custom JavaScript file

    inlines = [
        BestPaintedImageInline,
        PlayerInline,
    ]  # Add inline editor for "Best Painted" images

    def get_queryset(self, request):
        query_set = super().get_queryset(request)
        if request.user.is_superuser:
            return query_set  # Superusers see everything
        return query_set.filter(to=request.user)

    def save_model(self, request, obj, form, change):
        if not obj.pk:  # Only set created_by on new objects
            obj.tournament_organiser = request.user
        super().save_model(request, obj, form, change)

    readonly_fields = ["spaces_available", "paid_players", "signed_up_players"]

    fieldsets = [
        (
            "Basic Details",
            {
                "fields": [
                    "name",
                    "date",
                    "max_spaces",
                    "paid_players",
                    "spaces_available",
                    "level",
                    "venue",
                    "description",
                    "artwork",
                ]
            },
        ),
    ]


admin.site.register(Event, EventAdmin)
