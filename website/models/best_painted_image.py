from . import Event
from django.db import models
from cloudinary.models import CloudinaryField
from django.utils.safestring import mark_safe


class BestPaintedImage(models.Model):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="best_painted_images"
    )
    painter = models.CharField(max_length=50)
    title = models.CharField(max_length=50)
    image = CloudinaryField("image")  # Cloudinary image field
    is_winner = models.BooleanField()

    def __str__(self):
        return f"{self.painter}: {self.title}"

    def file_preview(self):
        if self.image:
            # If it's an image, display the image preview
            return mark_safe(
                f'<img src="{self.image.url}" style="max-height: 200px; max-width: 200px;" />'
            )

        return mark_safe(
            '<img style="max-height: 200px; max-width: 200px;" alt="No image" />'
        )

    file_preview.short_description = "Preview"  # Admin column name
