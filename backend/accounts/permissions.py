from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        print(request.user)
        if obj.school.user.id == request.user:
            return True

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.type == 0:
            return True
        

class IsSchoolAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.type == 1:
            return True

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.type == 2:
            return True


