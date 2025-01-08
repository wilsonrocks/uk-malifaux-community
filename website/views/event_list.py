from django.views.generic import ListView
from website.models import Event


class EventListView(ListView):
    model = Event
    ordering = "date"
