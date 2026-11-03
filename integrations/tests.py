from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User

from .soap import SoapServiceError


class SoapCountriesViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="soap-user@example.com",
            password="SoapUserPassword123!",
        )

    @patch("integrations.views.fetch_countries")
    def test_authenticated_request_returns_country_list(self, fetch_countries):
        fetch_countries.return_value = [
            {"country_code": "MX", "name": "Mexico"},
            {"country_code": "US", "name": "United States"},
        ]
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/v1/integrations/countries/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["country_code"], "MX")
        self.assertEqual(len(response.data), 2)

    def test_anonymous_request_is_rejected(self):
        response = self.client.get("/api/v1/integrations/countries/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("integrations.views.fetch_countries", side_effect=SoapServiceError("Upstream unavailable"))
    def test_service_failure_returns_gateway_error(self, fetch_countries):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/v1/integrations/countries/")

        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertEqual(
            response.data["detail"],
            "El servicio de países no está disponible. Intenta de nuevo más tarde.",
        )
        fetch_countries.assert_called_once_with()
