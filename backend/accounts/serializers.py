from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'type'] 
    
    def create(self, validated_data):
        """ Creates and returns a new user """

        # Validating Data
        user = User(
            name=validated_data['name'],
            email=validated_data['email'],
            type=validated_data['type'],
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
    
    def update(self, instance, validated_data):
        
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.set_password(validated_data.get('password', instance.password))
        
        instance.save()
        
        return instance
    










