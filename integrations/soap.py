from collections.abc import Mapping

import requests
from zeep import Client
from zeep.exceptions import Error as ZeepError
from zeep.helpers import serialize_object
from zeep.transports import Transport


COUNTRY_INFO_WSDL = (
    "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL"
)


class SoapServiceError(Exception):
    pass


def fetch_countries():
    session = requests.Session()
    transport = Transport(
        session=session,
        timeout=10,
        operation_timeout=10,
    )
    try:
        service = Client(COUNTRY_INFO_WSDL, transport=transport).service
        rows = service.ListOfCountryNamesByName()
    except (requests.RequestException, ZeepError) as error:
        raise SoapServiceError("No fue posible consultar el servicio SOAP de países.") from error
    finally:
        session.close()

    countries = []
    for row in rows or []:
        item = serialize_object(row)
        if not isinstance(item, Mapping):
            raise SoapServiceError("El servicio SOAP devolvió un formato de país no válido.")
        country_code = item.get("sISOCode") or item.get("ISOCode")
        name = item.get("sName") or item.get("Name")
        if not country_code or not name:
            raise SoapServiceError("El servicio SOAP devolvió un país sin código o nombre.")
        countries.append({"country_code": str(country_code), "name": str(name)})

    if not countries:
        raise SoapServiceError("El servicio SOAP no devolvió países.")
    return countries
