from django.views.generic.base import TemplateView
from website.models import Event, Team, Venue


class HomePageView(TemplateView):
    template_name = "website/home_page.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        events = Event.objects.all()
        context["events"] = (
            events  # TODO refactor to a count and a sample of 5 (maybe prioritise GTs/soonest)
        )
        context["teams"] = Team.objects.all()
        context["venues"] = Venue.objects.all()
        return context
