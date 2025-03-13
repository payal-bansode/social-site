from django.db import models
from account.models import CustomUser

from uuid import uuid4
from django.utils.deconstruct import deconstructible
from django.core.exceptions import ValidationError

from django.core.validators import FileExtensionValidator 
import os




@deconstructible
class UploadToPathAndRename(object):
    def __init__(self, path):
        self.sub_path = path

    def __call__(self, instance, filename):
        try:
            jpg = filename.split('.')[-1]
            userID = instance.pk if instance.pk else 'default_post'
            # print(userID)
            # filename = 'IMG{}.{}'.format(uuid4().hex, jpg)
            filename = f'IMG{uuid4().hex}.{jpg}'
            return os.path.join(self.sub_path, str(userID), filename)
        except Exception as e:
            # Log the error (you can use Django's logging system)
            raise ValidationError(f"Error generating file path: {str(e)}")




class PostTable(models.Model):
    post =  models.FileField(upload_to=UploadToPathAndRename('user_post'),
                                    validators=[FileExtensionValidator([
                            'jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp',  # Image formats
                            'mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'webm', 'mpeg', '3gp'  # Video formats
                                        ])],)
    
    created_by=models.ForeignKey(CustomUser,on_delete=models.SET_NULL,blank=True,null=True)
    
    description =  models.TextField(null=True,blank=True)
    created_date= models.DateTimeField(auto_now_add=True)
    updated_date= models.DateTimeField(auto_now=True)
    
    likes =  models.ManyToManyField(CustomUser,related_name='user_likes',blank=True,null=True)
                                 
                                 
                                 
                     
                     
class CommentTable(models.Model):
    on_post=models.ForeignKey(PostTable,on_delete=models.CASCADE)
    created_by=models.ForeignKey(CustomUser,on_delete=models.CASCADE,)
    
    comment =  models.TextField()
    
    created_date= models.DateTimeField(auto_now_add=True)
    updated_date= models.DateTimeField(auto_now=True)
    
    
    
    
    
class StoryTable(models.Model):
    story =  models.FileField(upload_to=UploadToPathAndRename('user_story'),
                                    validators=[FileExtensionValidator([
                            'jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp',  # Image formats
                            'mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'webm', 'mpeg', '3gp'  # Video formats
                                        ])],)
    
    created_by=models.ForeignKey(CustomUser,on_delete=models.CASCADE,blank=True,null=True)
    
    created_date= models.DateTimeField(auto_now_add=True)
    updated_date= models.DateTimeField(auto_now=True)
    
    likes =  models.ManyToManyField(CustomUser,related_name='user_story_like',blank=True,null=True)