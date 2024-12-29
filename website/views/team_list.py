from django.views.generic import ListView
from website.models import Team


class TeamListView(ListView):
    model = Team
