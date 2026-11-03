import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { registerApi } from "../../api/user.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function Register() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      telefono: "",
      password: "",
      password_confirm: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Escribe un correo electrónico válido.")
        .required("El correo electrónico es obligatorio."),
      first_name: Yup.string().required("El nombre es obligatorio."),
      last_name: Yup.string().required("El apellido es obligatorio."),
      telefono: Yup.string().max(20, "El teléfono admite hasta 20 caracteres."),
      password: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .required("La contraseña es obligatoria."),
      password_confirm: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden.")
        .required("Confirma tu contraseña."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const user = { ...values };
      delete user.password_confirm;
      try {
        await registerApi(user);
        toast.success("Tu cuenta fue creada. Ya puedes iniciar sesión.");
        navigate("/login", { replace: true });
      } catch (error) {
        toast.error(error.message || "No fue posible crear la cuenta.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (auth) {
    return <Navigate to="/dashboard" replace />;
  }

  const fieldError = (name) => (
    formik.touched[name] && formik.errors[name]
      ? { content: formik.errors[name], pointing: "below" }
      : false
  );

  return (
    <section className="page page--narrow">
      <div className="page__card">
        <p className="page__eyebrow">Únete a TechStore</p>
        <h1 className="page__title">Crear cuenta</h1>
        <p className="page__text">Completa tus datos para registrarte.</p>

        <Form onSubmit={formik.handleSubmit} noValidate>
          <Form.Input
            label="Correo electrónico"
            name="email"
            type="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("email")}
          />
          <div className="form-row">
            <Form.Input
              label="Nombre"
              name="first_name"
              autoComplete="given-name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("first_name")}
            />
            <Form.Input
              label="Apellido"
              name="last_name"
              autoComplete="family-name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("last_name")}
            />
          </div>
          <Form.Input
            label="Teléfono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            value={formik.values.telefono}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("telefono")}
          />
          <Form.Input
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("password")}
          />
          <Form.Input
            label="Confirmar contraseña"
            name="password_confirm"
            type="password"
            autoComplete="new-password"
            value={formik.values.password_confirm}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("password_confirm")}
          />
          <Button
            type="submit"
            primary
            fluid
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting}
          >
            Crear cuenta
          </Button>
        </Form>

        <p className="form-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}
