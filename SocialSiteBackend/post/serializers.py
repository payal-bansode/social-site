from rest_framework import serializers
from .models import PostTable,CommentTable,StoryTable


class PostListSerializer(serializers.ModelSerializer):
    
    created_by=serializers.SerializerMethodField()
    profile_pic=serializers.SerializerMethodField()
    
    class Meta:
        model =PostTable
        fields = ['id','post','created_by','profile_pic','description','created_date','likes']
        read_only_fields = ['created_date']  # Don't allow the client to set 'created_at'
        
    def get_created_by(self,obj):
        return obj.created_by.username  # Accessing the 'username' of the 'created_by' user
    
    def get_profile_pic(self,obj):
        # Access the 'profile_pic' of the 'created_by' user
        request = self.context.get('request')
        
        # Ensure there's a request object and the created_by user has a profile pic
        if obj.created_by.profile_pic and request:
            return request.build_absolute_uri(obj.created_by.profile_pic.url)
        
        return None
        
        
class PostDetailSerializer (serializers.ModelSerializer):
    class Meta:
        model =PostTable
        fields = ['id','post','created_by','description','created_date','likes']
        read_only_fields = ['created_date']  # Don't allow the client to set 'created_a
        
        
class CommentSerializer(serializers.ModelSerializer):
    created_by=serializers.SerializerMethodField()
    profile_pic=serializers.SerializerMethodField()
    class Meta:
        model = CommentTable
        fields = '__all__'  # or list the fields you need specifically
        read_only_fields = ['created_date']  # Don't allow the client to set 'created_a
        
    def get_created_by(self,obj):
        # print(obj.created_by.username)
        return obj.created_by.username  # Accessing the 'username' of the 'created_by' user
    
    
    def get_profile_pic(self,obj):
        request = self.context.get('request')
        
        # Ensure there's a request object and the created_by user has a profile pic
        if obj.created_by.profile_pic and request:
            return request.build_absolute_uri(obj.created_by.profile_pic.url)
    
    def create(self, validated_data):
        # Handle the creation of the comment, possibly adjusting for any read-only fields
        post = validated_data.get('on_post')  # Assuming 'on_post' is a foreign key to the PostTable model
        user = self.context['request'].user  # This will give you the logged-in user
        validated_data['created_by'] = user  # Automatically set the 'created_by' field
        # Handle the creation logic
        commentobj = CommentTable.objects.create(**validated_data)
        return commentobj
    
    
    

class StorySerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()  # To return the username of the user

    class Meta:
        model = StoryTable
        fields = ['id', 'story', 'created_by', 'created_date', 'updated_date']  # Include necessary fields
        read_only_fields = ['created_by', 'created_date', 'updated_date']

    def get_created_by(self, obj):
        return obj.created_by.username if obj.created_by else None  # Return username for the created_by user