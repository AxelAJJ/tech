from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserViewSet, MyProfileView

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("users/me/", MyProfileView.as_view(), name="my-profile"),
    path("", include(router.urls)),
]
