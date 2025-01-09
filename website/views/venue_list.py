from django.views.generic import ListView
from website.models import Venue


class VenueListView(ListView):
    model = Venue
