from django.contrib import admin
from website.models import (
    PlayImage,
    PrizeImage,
    BestPaintedImage,
    Winner,
    Player,
    Event,
    SwagImage,
)
from .base_image_inline import BaseImageInline


class BestPaintedImageInline(BaseImageInline):
    model = BestPaintedImage
    custom_fields = [
        "painter",
        "title",
        "is_winner",
    ]


class PlayImageInline(BaseImageInline):
    model = PlayImage
    custom_fields = ["caption"]


class PrizeImageInline(BaseImageInline):
    model = PrizeImage
    custom_fields = ["name", "description"]


class WinnerInline(BaseImageInline):
    model = Winner
    custom_fields = ["name", "position"]


class SwagImageInline(BaseImageInline):
    model = SwagImage
    custom_fields = ["name", "description"]


class PlayerInline(admin.TabularInline):
    model = Player


class EventAdmin(admin.ModelAdmin):

    class Media:
        js = ("/static/website/js/custom_admin.js",)  # Add your custom JavaScript file

    inlines = [
        BestPaintedImageInline,
        PlayerInline,
        WinnerInline,
        SwagImageInline,
        PlayImageInline,
        PrizeImageInline,
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
                    "days",
                    "rounds",
                    "variant",
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
