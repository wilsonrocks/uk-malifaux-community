from . import Event
from django.db import models
from cloudinary.models import CloudinaryField
from django.utils.safestring import mark_safe
from .mixins import ImagePreviewMixin


class SwagImage(models.Model, ImagePreviewMixin):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="swag_images"
    )

    image = CloudinaryField("image")  # Cloudinary image field

    name = models.CharField(max_length=50, blank=True)
    description = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.caption

    