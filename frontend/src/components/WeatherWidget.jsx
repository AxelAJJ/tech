import { useEffect, useState } from "react";

import { getWeather } from "../api/user.js";

export function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      try {
        const result = await getWeather(controller.signal);
        setWeather(result);
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

    void loadWeather();
    return () => controller.abort();
  }, []);

  return (
    <section className="widget" aria-labelledby="weather-title">
      <div className="widget__heading">
        <div>
          <p className="page__eyebrow">API externa · Open-Meteo</p>
          <h2 className="widget__title" id="weather-title">Clima en Hermosillo</h2>
        </div>
        <span className="widget__icon" aria-hidden="true">☀</span>
      </div>

      {isLoading && <p className="widget__message" role="status">Consultando el clima…</p>}
      {!isLoading && error && (
        <p className="widget__error" role="alert">{error}</p>
      )}
      {!isLoading && weather && (
        <>
          <div className="weather-values">
            <p><strong>{weather.temperature} °C</strong><span>Temperatura</span></p>
            <p><strong>{weather.humidity} %</strong><span>Humedad relativa</span></p>
          </div>
          <p className="widget__caption">
            Actualizado: {new Date(weather.time).toLocaleString("es-MX")}
          </p>
        </>
      )}
    </section>
  );
}
