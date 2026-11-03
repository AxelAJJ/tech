import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="page">
      <div className="page__card">
        <p className="page__eyebrow">Bienvenido a TechStore</p>
        <h1 className="page__title">Tecnología para tus ideas</h1>
        <p className="page__text">
          Explora la aplicación y accede a tu cuenta. El inicio de sesión y el
          registro se conectarán al backend en el siguiente paso.
        </p>
        <div className="page__actions">
          <Link className="page-link-button" to="/login">Iniciar sesión</Link>
          <Link className="page-link-button page-link-button--secondary" to="/register">
            Crear una cuenta
          </Link>
        </div>
      </div>
    </section>
  );
}
