from django.db import models
from django.contrib.auth.models import User
from tinymce.models import HTMLField
from . import Venue
from cloudinary.models import CloudinaryField


class Event(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(blank=False, max_length=200)
    date = models.DateField(blank=False)
    level = models.CharField(
        max_length=200,
        choices={"MASTERS": "Masters", "GT": "GT", "STANDARD": "Standard"},
    )
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="events")
    max_spaces = models.IntegerField()
    rounds = models.IntegerField(default=3)
    days = models.IntegerField(default=1)
    variant = models.TextField(
        blank=False,
        max_length=100,
        default="GG4, Singles",
        help_text="This should be a short description of the tournament setup. It will be inserted into the sentence 'X rounds of WHAT_YOU_ENTER_HERE' and should not be a sentence on its own. E.g. 'Singles, Bans 1, No Repeating Strategies' or 'Singles, GG4",
    )
    description = HTMLField()
    tournament_organiser = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name="events"
    )
    artwork = CloudinaryField("artwork", blank=True)

    # players - one to many from Player``

    @property
    def spaces_available(self):
        if self.max_spaces == None:
            return None
        number_of_attendees = self.players.count()
        return self.max_spaces - number_of_attendees

    @property
    def paid_players(self):
        return len([x for x in self.players.all() if x.paid == True])

    @property
    def signed_up_players(self):
        return len(self.players.count())

    @property
    def month(self):
        # Use the date to get the full month name and year
        return self.date.strftime("%B %Y")  # Example: "January 2025"

    @property
    def short_description(self):
        output = []
        if self.rounds:
            output.append(f"{self.rounds} rounds of")

        if self.variant:
            output.append(self.variant)

        if self.days > 1:
            output.append(f"over {self.days} days")

        return " ".join(output)

    # Best Painted
    # best_painted_images - one to many

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["date"]
