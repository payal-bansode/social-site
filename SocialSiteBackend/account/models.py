from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser



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
            userID = instance.pk if instance.pk else 'default_profilepic'
            # print(userID)
            # filename = 'IMG{}.{}'.format(uuid4().hex, jpg)
            filename = f'IMG{uuid4().hex}.{jpg}'
            return os.path.join(self.sub_path, str(userID), filename)
        except Exception as e:
            # Log the error (you can use Django's logging system)
            raise ValidationError(f"Error generating file path: {str(e)}")





# Create your models here.
class CustomUser(AbstractUser):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('N', 'Prefer not to say'),
    ]
    
    # Remove first_name and last_name from the model
    first_name = None
    last_name = None
    

    name = models.CharField(max_length=255)  # Single field for full name
    username = models.CharField(max_length=150, unique=True)  # Ensure username is unique
    email = models.EmailField(unique=True)  # Email is now the username field
    profile_pic = models.ImageField(upload_to=UploadToPathAndRename('profile_pic'),
                                    validators=[FileExtensionValidator(['jpeg','jpg','JPEG','JPG','png'])],
                                    null=True,blank=True)
    headline = models.CharField(max_length=250, null=True, blank=True,default="")
    address = models.TextField(null=True, blank=True,default="")  # Single field for address

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES,default="N", null=True, blank=True)
        
    is_public = models.BooleanField(default=False)  # Default is public profile
    
    friends = models.ManyToManyField('self', symmetrical=True, blank=True,related_name='friends')

    USERNAME_FIELD = 'email'  # Use email as the primary identifier for login
    REQUIRED_FIELDS = ['name', 'username']  # Username is required for creating a user
    
    
        

    def __str__(self):
        return self.username
    
    
