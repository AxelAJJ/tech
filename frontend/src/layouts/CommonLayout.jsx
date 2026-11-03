import { Link } from "react-router-dom";

export function CommonLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="app-header__brand" to="/home">TechStore</Link>
        <nav className="app-header__nav" aria-label="Navegación de cuenta">
          <Link className="app-header__link" to="/login">Iniciar sesión</Link>
          <Link className="app-header__link" to="/register">Crear cuenta</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">TechStore · Tu tienda de tecnología</footer>
    </div>
  );
}