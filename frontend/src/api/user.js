const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getErrorMessage(data, fallback) {
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data?.non_field_errors)) {
    return data.non_field_errors.join(" ");
  }

  if (data && typeof data === "object") {
    const firstError = Object.values(data).flat().find((value) => typeof value === "string");
    if (firstError) {
      return firstError;
    }
  }

  return fallback;
}

async function requestJson(path, { method = "GET", body, token, signal } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }
    throw new Error(
      "No fue posible conectar con el backend. Verifica que Django esté activo.",
      { cause: error },
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    if (response.ok) {
      throw new Error("El backend devolvió una respuesta JSON no válida.");
    }
    throw new ApiError(`La solicitud falló (HTTP ${response.status}).`, response.status);
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, `La solicitud falló (HTTP ${response.status}).`),
      response.status,
    );
  }

  return data;
}

export function loginApi(credentials) {
  return requestJson("/api/token/", { method: "POST", body: credentials });
}

export function refreshTokenApi(refresh) {
  return requestJson("/api/token/refresh/", {
    method: "POST",
    body: { refresh },
  });
}

export function getMeApi(token) {
  return requestJson("/api/v1/users/me/", { token });
}

export function registerApi(user) {
  return requestJson("/api/v1/auth/register/", { method: "POST", body: user });
}

export function getSoapCountriesApi(token, signal) {
  return requestJson("/api/v1/integrations/countries/", { token, signal });
}

export async function getWeather(signal) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: "29.0729",
    longitude: "-110.9559",
    current: "temperature_2m,relative_humidity_2m",
    timezone: "America/Hermosillo",
  }).toString();

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }
    throw new Error("No fue posible conectar con el servicio del clima.", { cause: error });
  }

  if (!response.ok) {
    throw new Error(`El servicio del clima respondió con HTTP ${response.status}.`);
  }

  const data = await response.json();
  const current = data.current;
  if (
    !current ||
    !Number.isFinite(current.temperature_2m) ||
    !Number.isFinite(current.relative_humidity_2m)
  ) {
    throw new Error("El servicio del clima devolvió datos incompletos.");
  }

  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    time: current.time,
  };
}
