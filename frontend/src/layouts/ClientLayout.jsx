import { Link } from "react-router-dom";

export function ClientLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="app-header__brand" to="/home">TechStore</Link>
        <nav className="app-header__nav" aria-label="Navegación principal">
          <Link className="app-header__link" to="/home">Inicio</Link>
          <Link className="app-header__link" to="/login">Iniciar sesión</Link>
          <Link className="app-header__link" to="/register">Crear cuenta</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">TechStore · Tecnología para todos</footer>
    </div>
  );
}