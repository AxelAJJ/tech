import { WeatherWidget } from "../../components/WeatherWidget.jsx";
import { SoapCountriesWidget } from "../../components/SoapCountriesWidget.jsx";
import { useAuth } from "../../hooks/useAuth.js";

export default function Dashboard() {
  const { auth } = useAuth();
  const userName = [auth.me.first_name, auth.me.last_name].filter(Boolean).join(" ");

  return (
    <section className="page dashboard">
      <div className="dashboard__welcome">
        <p className="page__eyebrow">Área personal</p>
        <h1 className="page__title">
          ¡Bienvenido{userName ? `, ${userName}` : ""}!
        </h1>
        <p className="page__text">
          Has iniciado sesión como <strong>{auth.me.email}</strong>
          {auth.me.telefono ? ` · Teléfono: ${auth.me.telefono}` : ""}.
        </p>
      </div>

      <div className="dashboard__widgets">
        <WeatherWidget />
        <SoapCountriesWidget />
      </div>
    </section>
  );
}
