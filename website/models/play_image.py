from . import Event
from django.db import models
from cloudinary.models import CloudinaryField
from django.utils.safestring import mark_safe
from .mixins import ImagePreviewMixin


class PlayImage(models.Model, ImagePreviewMixin):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="play_images"
    )

    image = CloudinaryField("image")  # Cloudinary image field

    caption = models.CharField(max_length=100)

    def __str__(self):
        return self.caption

    