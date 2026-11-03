import { useContext } from "react";

import { AuthContext } from "../context/auth-context.js";

export function useAuth() {
  const auth = useContext(AuthContext);
  if (auth === null) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }
  return auth;
}
