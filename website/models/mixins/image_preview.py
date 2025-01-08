from django.utils.safestring import mark_safe


class ImagePreviewMixin:
    """Requires a field called image to work properly."""
    def file_preview(self):
        if hasattr(self, 'image') and self.image:
            # If the model has an 'image' field and it's not empty, display the preview
            return mark_safe(
                f'<img src="{self.image.url}" style="max-height: 200px; max-width: 200px;" />'
            )

        # Default image preview if no image is available
        return mark_safe(
            '<img style="max-height: 200px; max-width: 200px;" alt="No image" />'
        )

    file_preview.short_description = "Preview"  # Admin column name
