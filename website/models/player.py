from django.db import models
from . import Event


class Player(models.Model):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, null=False, related_name="players"
    )
    name = models.CharField(max_length=50)
    paid = models.BooleanField(default=False, null=False)
