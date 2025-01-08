from . import Event
from django.db import models
from cloudinary.models import CloudinaryField
from django.utils.safestring import mark_safe
from .mixins import ImagePreviewMixin


class Winner(models.Model, ImagePreviewMixin):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="winners"
    )

    image = CloudinaryField("image", blank=True)  # Cloudinary image field

    name = models.CharField(max_length=50, )
    position = models.CharField(max_length=50,)

    def __str__(self):
        return self.name

    