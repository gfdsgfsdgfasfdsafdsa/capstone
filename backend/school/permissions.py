from rest_framework import permissions
from .models import Exam

class IsExamOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj, *args, **kwargs):
        try:
            exam = Exam.objects.get(school__user_id=request.user.id)
            print(obj.id, exam.id)
            if kwargs['pk'] != exam.id:
                return True
        except (Exception,):
            return False
