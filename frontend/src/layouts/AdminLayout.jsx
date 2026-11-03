import { Link, Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

export function AdminLayout({ children }) {
  const { auth, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <main className="page" role="status">Verificando tu sesión…</main>;
  }

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="app-header__brand" to="/home">TechStore</Link>
        <nav className="app-header__nav" aria-label="Navegación de administración">
          <Link className="app-header__link" to="/dashboard">Dashboard</Link>
          <button className="app-header__link app-header__button" onClick={logout} type="button">
            Cerrar sesión
          </button>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">TechStore · Administración</footer>
    </div>
  );
}
