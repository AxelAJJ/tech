import { useCallback, useEffect, useMemo, useState } from "react";

import { getMeApi, refreshTokenApi } from "../api/user.js";
import { clearTokens, getTokens, saveTokens } from "../api/token.js";
import { AuthContext } from "./auth-context.js";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const login = useCallback(async (access, refresh) => {
    if (!access) {
      throw new Error("El backend no devolvió un token de acceso.");
    }

    saveTokens(access, refresh);
    try {
      const me = await getMeApi(access);
      setAuth({ access, refresh: refresh || null, me });
      setAuthError(null);
      return me;
    } catch (error) {
      clearTokens();
      setAuth(null);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setAuth(null);
    setAuthError(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const stored = getTokens();
      if (!stored.access) {
        if (active) {
          setAuth(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        let access = stored.access;
        let refresh = stored.refresh;
        let me;

        try {
          me = await getMeApi(access);
        } catch (error) {
          if (error.status !== 401 || !refresh) {
            throw error;
          }

          const renewed = await refreshTokenApi(refresh);
          access = renewed.access;
          refresh = renewed.refresh || refresh;
          saveTokens(access, refresh);
          me = await getMeApi(access);
        }

        if (active) {
          setAuth({ access, refresh, me });
          setAuthError(null);
        }
      } catch (error) {
        if (error.status === 401) {
          clearTokens();
        }
        if (active) {
          setAuth(null);
          setAuthError(error.message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({ auth, authError, isLoading, login, logout }),
    [auth, authError, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
