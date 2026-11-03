from rest_framework import serializers


class CountrySerializer(serializers.Serializer):
    country_code = serializers.CharField()
    name = serializers.CharField()
