from django.db import models
from .mixins import ImagePreviewMixin
from tinymce.models import HTMLField
from . import Page


class PageContentText(models.Model, ImagePreviewMixin):
    page = models.ForeignKey(
        Page, on_delete=models.CASCADE, null=True, related_name="page_content_items"
    )

    key = models.CharField(max_length=30, blank=False)

    html = HTMLField()

    class Meta:
        unique_together = ["page", "key"]

    def __str__(self):
        return self.page.page_name
