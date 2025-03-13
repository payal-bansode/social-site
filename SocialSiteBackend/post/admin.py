from django.contrib import admin

# Register your models here.
from .models import PostTable,CommentTable,StoryTable

admin.site.register(PostTable)
admin.site.register(CommentTable)
admin.site.register(StoryTable)