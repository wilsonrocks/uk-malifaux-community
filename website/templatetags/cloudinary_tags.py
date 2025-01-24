from django import template
import cloudinary

register = template.Library()

# TODO make this return the actual HTML


@register.simple_tag
def cloudinary_responsive_image(public_id, width=None):
    """
    Generates a Cloudinary URL with transformations for responsive images.
    """
    transformations = {
        "crop": "scale",
        "width": width or "auto",
        "quality": "auto",
        "fetch_format": "auto",
    }
    return cloudinary.CloudinaryImage(public_id).build_url(
        **transformations, secure=True
    )


@register.simple_tag
def cloudinary_thumbnail(public_id, size):
    transformations = {
        "crop": "thumb",
        "gravity": "auto",
        "width": size,
        "height": size,
        "quality": "auto",
        "fetch_format": "auto",
    }
    return cloudinary.CloudinaryImage(public_id).build_url(
        **transformations, secure=True
    )


@register.simple_tag
def responsive_image(public_id):
    return f"<em>{public_id}</em>"
