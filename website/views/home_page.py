from django.views.generic.base import TemplateView
from website.models import Event, Team, Venue
from django.utils.timezone import now


class HomePageView(TemplateView):
    template_name = "website/home_page.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["events"] = Event.objects.filter(date__gte=now()).order_by("date")[
            :3
        ]  # TODO at some point, prioritise GTs?
        context["teams"] = Team.objects.all()
        context["venues"] = Venue.objects.all()
        return context
