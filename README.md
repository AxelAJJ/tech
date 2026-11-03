# TechStore API + Frontend

Aplicacion académica con Django REST Framework y React. Incluye cuentas por correo,
autenticacion JWT, perfil protegido, widget del clima mediante Open-Meteo y un endpoint
de Django que consume el servicio SOAP de países con Zeep.

## Requisitos

- Python 3.10 o posterior.
- Node.js y npm.
- Acceso a Internet para Open-Meteo y el servicio SOAP de países.

## Iniciar el backend

Desde la raíz del repositorio, en PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

El backend queda disponible en `http://127.0.0.1:8000/`.

## Iniciar el frontend

En una segunda terminal, desde la raíz:

```powershell
Set-Location frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Abre la dirección que indique Vite, normalmente `http://localhost:5173/`. El frontend
usa `VITE_API_BASE_URL` del archivo `frontend/.env` para conectarse al backend. CORS
está limitado a `localhost:5173` y `127.0.0.1:5173`.

## Flujo de usuario

1. Crea una cuenta desde `/register` con correo, nombre, apellido, teléfono y contraseña.
2. Inicia sesión en `/login`. El frontend solicita el JWT y consulta el perfil.
3. El Dashboard protegido presenta los datos del usuario y dos widgets.
4. Cierra sesión desde el botón de navegación.

Los access y refresh tokens se conservan en `localStorage` para mantener la sesión en
este ejercicio; el código no los imprime en consola. La vigencia del access token está
configurada en 30 minutos.

## APIs

- `POST /api/v1/auth/register/`: registro público.
- `POST /api/token/`: obtiene access y refresh tokens usando correo y contraseña.
- `POST /api/token/refresh/`: renueva el access token.
- `GET /api/v1/users/me/`: obtiene el perfil con `Authorization: Bearer <access>`.
- `GET /api/v1/integrations/countries/`: consulta el servicio SOAP de países con Zeep;
  requiere autenticación JWT.
- `GET /api/docs/`: documentación Swagger.

El widget del clima consulta Open-Meteo desde React. El widget de países consulta el
endpoint de Django, que a su vez solicita los datos al servicio SOAP CountryInfo.

## Validación

Desde la raíz:

```powershell
python manage.py test users integrations
```

Desde `frontend/`:

```powershell
npm run lint
npm run build
```

`.gitignore` excluye el entorno virtual y `db.sqlite3`. No publiques archivos `.env`
con valores privados.
