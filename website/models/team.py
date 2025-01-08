from django.db import models
from django.contrib.auth.models import User
from tinymce.models import HTMLField
from . import Venue


class Team(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    captain = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name="teams"
    )
    name = models.CharField(blank=False, max_length=200)
    description = HTMLField()
    usual_venue = models.ForeignKey(
        Venue, on_delete=models.CASCADE, related_name="teams"
    )

    def __str__(self):
        return self.name
