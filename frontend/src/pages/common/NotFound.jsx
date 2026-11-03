import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page">
      <div className="page__card">
        <p className="page__eyebrow">Error 404</p>
        <h1 className="page__title">Página no encontrada</h1>
        <p className="page__text">
          La dirección que buscas no existe o pudo haber cambiado.
        </p>
        <Link className="page-link-button" to="/home">Volver al inicio</Link>
      </div>
    </section>
  );
}
