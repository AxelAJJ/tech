import logging

from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CountrySerializer
from .soap import SoapServiceError, fetch_countries


logger = logging.getLogger(__name__)


class SoapCountriesView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses=CountrySerializer(many=True))
    def get(self, request):
        try:
            countries = fetch_countries()
        except SoapServiceError:
            logger.exception("No se pudo completar la consulta al servicio SOAP de países.")
            return Response(
                {"detail": "El servicio de países no está disponible. Intenta de nuevo más tarde."},
                status=502,
            )
        return Response(countries)
