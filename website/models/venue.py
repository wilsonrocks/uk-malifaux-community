from django.db import models
from tinymce.models import HTMLField


class Venue(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(blank=False, max_length=200)
    description = HTMLField()
    email = models.EmailField(max_length=200, blank=True)
    website = models.URLField(max_length=200, blank=True)
    instagram = models.URLField(max_length=200, blank=True)
    discord = models.URLField(max_length=200, blank=True)
    first_line = models.CharField(max_length=200, blank=True)
    second_line = models.CharField(max_length=200, blank=True)
    third_line = models.CharField(max_length=200, blank=True)
    city = models.CharField(
        blank=False,
        max_length=200,
    )
    postcode = models.CharField(
        blank=False,
        max_length=200,
    )
    is_store = models.BooleanField(default=False)
    stocks_malifaux = models.BooleanField(default=False)
    plays_malifaux = models.BooleanField(default=False)

    def __str__(self):
        return self.name
