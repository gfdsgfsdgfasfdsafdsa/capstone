from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.activated == '1':
            refresh = self.get_token(self.user)
            data['refresh'] = str(refresh)
            data['access'] = str(refresh.access_token)

            # Add extra responses here
            data['role'] = self.user.type
        else:
            data['refresh'] = None
            data['access'] = None
            data['role'] = None
        return data
