const ACCESS_TOKEN_KEY = "techstore_access_token";
const REFRESH_TOKEN_KEY = "techstore_refresh_token";

export function getTokens() {
  if (typeof window === "undefined") {
    return { access: null, refresh: null };
  }

  return {
    access: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    refresh: window.localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function saveTokens(access, refresh) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

export function clearTokens() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}
