# TechStore API

API REST de una tienda de tecnologia ficticia, desarrollada con Django REST Framework.
Incluye usuarios identificados por correo, el campo adicional `telefono`, CRUD para
administradores, consulta del perfil propio y autenticacion JWT.

## Instalacion (Windows PowerShell)

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Si PowerShell bloquea la activacion, usa CMD: `.venv\Scripts\activate.bat`.

## Direcciones

- Swagger (titulo **TechStore API**): http://127.0.0.1:8000/api/docs/
- Admin: http://127.0.0.1:8000/admin/
- Registro: `POST /api/v1/auth/register/`
- CRUD usuarios (solo administradores): `/api/v1/users/`
- Perfil del usuario autenticado: `GET /api/v1/users/me/`
- Obtener tokens: `POST /api/token/`
- Renovar access token: `POST /api/token/refresh/`

El usuario inicia sesion usando su correo electronico. `telefono` se administra desde
Django Admin y aparece en los serializers y en la documentacion Swagger. El access token
vence en 30 minutos; el refresh token, en 7 dias.

## Registro

```json
{
  "email": "alumno@example.com",
  "first_name": "Ana",
  "last_name": "Lopez",
  "telefono": "6531234567",
  "password": "ClaveSegura123!"
}
```

La contrasena se acepta al crear o actualizar un usuario, pero es write-only y nunca se
devuelve en la API. Si se edita un usuario sin incluir `password`, su contrasena actual
se conserva.

## Pruebas

```powershell
python manage.py test users
```

Las pruebas validan el login JWT por correo, el endpoint de perfil, la ausencia de
contrasenas en respuestas, la actualizacion de contrasena y que editar otros datos sin
enviar una contrasena no la cambia.

`.gitignore` excluye el entorno virtual, `db.sqlite3` y `.env`. No publiques claves
secretas reales en GitHub.

## Evidencias

Consulta [TechStore_API_Evidencias.pdf](./TechStore_API_Evidencias.pdf) para ver las capturas
de Swagger, autenticacion JWT, consulta del perfil y prueba de actualizacion segura.
