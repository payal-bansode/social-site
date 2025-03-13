from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    # gender= serializers.SerializerMethodField()
    friends=serializers.SerializerMethodField()
    
    # to ge the full url of the profile_pic
    profile_pic= serializers.ImageField(required=False)
    is_friend = serializers.SerializerMethodField()  # Add this field to check if the current user is a friend


    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'name', 'headline', 
                  'address', 'profile_pic', 'gender', 'is_public',
                  'friends','is_friend']

    extra_kwargs = {
            'headline': {'allow_null': True, 'required': False},
            'address': {'allow_null': True, 'required': False},
        }
    
    def get_friends(self, obj):
        return obj.friends.all().count()
    
    # def to_representation(self, instance):
    #     # First, call the parent class method to get the default serialized data
    #     data = super().to_representation(instance)
        
    #     request= self.context.get('request')
        
    #     # Check if the user is the owner of the instance

    #     is_owner= request and request.user==instance
    #     # Conditionally adjust the output based on the `is_public` field
    #     # when profile is PRIVATE
    #     if not instance.is_public and not is_owner:
    #         # Modify the data dictionary to only include selected fields for private profiles
    #         data = {
    #             'name' :instance.name,
    #             "username": instance.username,
    #              "profile_pic": self.get_profile_pic(instance) ,
    #             "headline": instance.headline,
    #             "is_public": instance.is_public,
    #             'friends':instance.friends.all().count()
    #         }
    #     return data
    
    def get_gender(self, obj):
        return obj.get_gender_display() 
    
    
    def get_profile_pic(self, obj):
        request = self.context.get('request')
        if obj.profile_pic and request:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None
    
    
    # PREVENT DIRECT UPDATE OF USER EMAIL
    def update(self, instance, validated_data):
        # Prevent email from being updated
        validated_data.pop('email', None)
        return super().update(instance, validated_data)
    
    def get_is_friend(self, obj):
        """
        Check if the logged-in user is a friend of the user whose details are being fetched.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Check if the logged-in user is in the `friends` relationship of the serialized user
            return request.user in obj.friends.all()
        return False
    
    
    
class FriendSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(required=False)
    is_friend = serializers.SerializerMethodField()  # Add this field to check if the current user is a friend
   
    class Meta:
        model = CustomUser
        fields = ['id','name', 'username', 'profile_pic','is_friend']
        
        
    def get_profile_pic(self, obj):
        request = self.context.get('request')
        if obj.profile_pic and request:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None
    
    def get_is_friend(self, obj):
        """
        Check if the logged-in user is a friend of the user whose details are being fetched.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Check if the logged-in user is in the `friends` relationship of the serialized user
            return request.user in obj.friends.all()
        return False