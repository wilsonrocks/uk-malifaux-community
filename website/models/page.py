from . import Event
from django.db import models
from cloudinary.models import CloudinaryField
from django.utils.safestring import mark_safe
from .mixins import ImagePreviewMixin


class Page(models.Model, ImagePreviewMixin):

    page_name = models.CharField(max_length=30, blank=False, unique=True)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=500)

    def __str__(self):
        return self.page_name
