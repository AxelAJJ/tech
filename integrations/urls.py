from django.urls import path

from .views import SoapCountriesView


urlpatterns = [
    path("countries/", SoapCountriesView.as_view(), name="soap-countries"),
]
