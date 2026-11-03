from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from .models import User


class UserSecurityTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            email="admin@example.com",
            password="AdminPassword123!",
        )
        self.user = User.objects.create_user(
            email="student@example.com",
            password="OriginalPassword123!",
            telefono="6531234567",
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin)

    def test_update_without_password_preserves_existing_password(self):
        response = self.client.patch(
            f"/api/v1/users/{self.user.pk}/",
            {"first_name": "Nombre Nuevo"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("OriginalPassword123!"))
        self.assertFalse(self.user.check_password("AdminPassword123!"))
        self.assertNotIn("password", response.data)

    def test_update_with_password_changes_only_to_submitted_password(self):
        response = self.client.patch(
            f"/api/v1/users/{self.user.pk}/",
            {"password": "NewStudentPassword123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewStudentPassword123!"))
        self.assertFalse(self.user.check_password("OriginalPassword123!"))
        self.assertNotIn("password", response.data)

    def test_password_never_appears_in_user_response(self):
        response = self.client.get(f"/api/v1/users/{self.user.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn("password", response.data)

    def test_profile_returns_authenticated_user_without_password(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/v1/users/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["telefono"], self.user.telefono)
        self.assertNotIn("password", response.data)

    def test_jwt_token_can_be_obtained_with_email(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(
            "/api/token/",
            {"email": self.user.email, "password": "OriginalPassword123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertNotIn("password", response.data)

    def test_registration_is_public_and_password_is_hidden(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(
            "/api/v1/auth/register/",
            {
                "email": "new@example.com",
                "first_name": "Nuevo",
                "telefono": "6530000000",
                "password": "StrongPassword123!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn("password", response.data)
        self.assertTrue(User.objects.get(email="new@example.com").check_password("StrongPassword123!"))

    def test_swagger_schema_documents_telefono_and_is_public(self):
        self.client.force_authenticate(user=None)
        response = self.client.get("/api/schema/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("telefono", str(response.data))

    def test_vite_origin_is_allowed_for_cors_preflight(self):
        response = self.client.options(
            "/api/v1/users/me/",
            HTTP_ORIGIN="http://localhost:5173",
            HTTP_ACCESS_CONTROL_REQUEST_METHOD="GET",
        )
        self.assertIn(response.status_code, (status.HTTP_200_OK, status.HTTP_204_NO_CONTENT))
        self.assertEqual(
            response["Access-Control-Allow-Origin"],
            "http://localhost:5173",
        )
