from django.views.generic import DetailView
from website.models import Team


class TeamDetailView(DetailView):
    model = Team

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
