from django.urls import path
from .views import HomePageView, EventListView, TeamListView
from .views.event_detail import EventDetailView

urlpatterns = [
    path("", HomePageView.as_view(), name="home_page"),
    path("events", EventListView.as_view(), name="event_list"),
    path("events/<pk>", EventDetailView.as_view(), name="event_detail"),
    path("teams", TeamListView.as_view(), name="team_list"),
]
