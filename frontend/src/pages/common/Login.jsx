import { useEffect } from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginApi } from "../../api/user.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function Login() {
  const { auth, authError, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authError) {
      toast.error(`No se pudo restaurar la sesión: ${authError}`);
    }
  }, [authError]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Escribe un correo electrónico válido.")
        .required("El correo electrónico es obligatorio."),
      password: Yup.string().required("La contraseña es obligatoria."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const tokens = await loginApi(values);
        if (!tokens.access || !tokens.refresh) {
          throw new Error("El backend no devolvió los tokens esperados.");
        }

        await login(tokens.access, tokens.refresh);
        console.info("JWT de acceso obtenido correctamente; el token no se imprime.");
        toast.success("Inicio de sesión correcto.");
        const destination = location.state?.from?.pathname || "/dashboard";
        navigate(destination, { replace: true });
      } catch (error) {
        toast.error(error.message || "No fue posible iniciar sesión.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (auth) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="page page--narrow">
      <div className="page__card">
        <p className="page__eyebrow">Tu cuenta TechStore</p>
        <h1 className="page__title">Iniciar sesión</h1>
        <p className="page__text">
          Usa el correo electrónico y la contraseña de tu cuenta.
        </p>

        <Form onSubmit={formik.handleSubmit} noValidate>
          <Form.Input
            label="Correo electrónico"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alumno@ejemplo.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email
              ? { content: formik.errors.email, pointing: "below" }
              : false}
          />
          <Form.Input
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password
              ? { content: formik.errors.password, pointing: "below" }
              : false}
          />
          <Button
            type="submit"
            primary
            fluid
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting}
          >
            Iniciar sesión
          </Button>
        </Form>

        <p className="form-footer">
          ¿Todavía no tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </section>
  );
}
