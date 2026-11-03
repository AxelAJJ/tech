import { useEffect, useState } from "react";

import { getSoapCountriesApi } from "../api/user.js";
import { useAuth } from "../hooks/useAuth.js";

export function SoapCountriesWidget() {
  const { auth } = useAuth();
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries() {
      try {
        const result = await getSoapCountriesApi(auth.access, controller.signal);
        setCountries(result);
        setError("");
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(requestError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadCountries();
    return () => controller.abort();
  }, [auth.access]);

  return (
    <section className="widget" aria-labelledby="soap-title">
      <div className="widget__heading">
        <div>
          <p className="page__eyebrow">Web Service SOAP · Zeep + Django</p>
          <h2 className="widget__title" id="soap-title">Países</h2>
        </div>
        <span className="widget__icon" aria-hidden="true">◎</span>
      </div>

      {isLoading && <p className="widget__message" role="status">Consultando el servicio SOAP…</p>}
      {!isLoading && error && (
        <p className="widget__error" role="alert">
          No se pudieron cargar los países: {error}
        </p>
      )}
      {!isLoading && !error && (
        <>
          <p className="widget__caption">
            Respuesta SOAP recibida desde Django: {countries.length} países.
          </p>
          <ul className="country-list">
            {countries.slice(0, 8).map((country) => (
              <li key={country.country_code}>
                <span>{country.name}</span>
                <code>{country.country_code}</code>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
