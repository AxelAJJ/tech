from rest_framework.permissions import BasePermission, SAFE_METHODS
class IsAdminOrSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        return request.method in SAFE_METHODS and obj.pk == request.user.pk
