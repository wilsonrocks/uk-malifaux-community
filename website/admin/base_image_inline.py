from django.contrib import admin


class BaseImageInline(admin.StackedInline):
    class Media:
        js = ("/static/website/js/custom_admin.js",)  # Add your custom JavaScript file

    readonly_fields = ["file_preview"]
    extra = 1  # Number of empty forms to display by default

    # Define default fields to include the image preview
    def get_fields(self, request, obj=None):
        return ["image", "file_preview"] + getattr(self, "custom_fields", [])
