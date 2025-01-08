from . import Event
from django.db import models
from cloudinary.models import CloudinaryField
from django.utils.safestring import mark_safe
from .mixins import ImagePreviewMixin


class BestPaintedImage(models.Model, ImagePreviewMixin):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="best_painted_images"
    )
    painter = models.CharField(max_length=50)
    title = models.CharField(max_length=50)
    image = CloudinaryField("image")  # Cloudinary image field
    is_winner = models.BooleanField()

    def __str__(self):
        return f"{self.painter}: {self.title}"

    