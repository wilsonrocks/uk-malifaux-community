from django.urls import path
from debug_toolbar.toolbar import debug_toolbar_urls

from .views import (
    HomePageView,
    EventListView,
    TeamListView,
    TeamDetailView,
    VenueListView,
    EventDetailView,
)

urlpatterns = [
    path("", HomePageView.as_view(), name="home_page"),
    path("events", EventListView.as_view(), name="event_list"),
    path("events/<pk>", EventDetailView.as_view(), name="event_detail"),
    path("teams", TeamListView.as_view(), name="team_list"),
    path("teams/<pk>", TeamDetailView.as_view(), name="team_detail"),
    path("venues", VenueListView.as_view(), name="venue_list"),
] + debug_toolbar_urls()
