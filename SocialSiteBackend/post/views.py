from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework import generics

from .models import PostTable,CommentTable,StoryTable
from account.models import CustomUser

from .serializers import PostListSerializer,PostDetailSerializer,CommentSerializer,StorySerializer
from rest_framework import viewsets
from account.searilizers import CustomUserSerializer

from rest_framework.exceptions import PermissionDenied

# Create your views here.

class PostAPIView(generics.ListCreateAPIView):
    """  to list the no of post for the current user and add new post
    """
    permission_classes =[IsAuthenticatedOrReadOnly]
    serializer_class  =  PostListSerializer
    
    def get_queryset(self):
        username = self.kwargs.get('username')
        
        # Get the user object
        user = CustomUser.objects.get(username=username)
        
        get_current_user= self.request.user.username
        
        is_friends_user =  user.friends.filter(username=get_current_user).exists()
        # Check if the user is not the same as the logged-in user, profile is private, and the user is not a friend
        if get_current_user != user.username and not user.is_public and not is_friends_user:
            return


        # Return posts for the user if the profile is public
        return PostTable.objects.filter(created_by=user).select_related().order_by('-created_date')

    def perform_create(self, serializer):
        # Add the username from the request to the new post
        user_obj= CustomUser.objects.get(username =self.request.user.username )
        serializer.save(created_by =user_obj)
        
        
        
        
class PostDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """ get the detailed post for one post and like it and delte the post
    """
    # queryset = Post.objects.all()
    serializer_class = PostDetailSerializer

    def get_object(self):
        try:
            return PostTable.objects.get(id=self.kwargs['pk'])
        except PostTable.DoesNotExist:
            raise NotFound(detail="Post not found.")


    # method for the like of the post
    def patch(self, request, *args, **kwargs):
        # If you want to "like" the post, we can increment the like count here
        post = self.get_object()
        if post.likes.filter(id=request.user.id).exists():
            
            post.likes.remove(request.user.id)
        else:
            # If the user hasn't liked the post yet, add them
            
            post.likes.add(request.user.id)
        post.save()
        return Response(PostDetailSerializer(post).data, status=status.HTTP_200_OK)
    
    
    
    # method for the deletion of post for the current user
    def destroy(self, request, *args, **kwargs):
        # Retrieve the post object
        post = self.get_object()

        # Check if the current user is the post's author
        if post.created_by != request.user:
            return Response(
                {"detail": "You do not have permission to delete this post."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Allow deletion if the user is the post's owner
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class HomePostListAPIView(generics.ListAPIView):
    permission_classes =[IsAuthenticated]
    serializer_class = PostListSerializer
    
    def get_queryset(self):
        current_user = self.request.user  # Get the current logged-in user
        # Get the friends of the current user (self.friends is the ManyToMany relation to other users)
        friend_list = CustomUser.objects.get(username =self.request.user.username)
        friends_of_current_user =[i.username  for i in friend_list.friends.all()]  
      
        
        
        # Query the PostTable where the 'created_by' is in the current user's friends list
        posts = PostTable.objects.filter(created_by__username__in= friends_of_current_user)

        return posts
    
    
class PostLikeListAPIView(generics.ListAPIView):
    permission_classes =[IsAuthenticatedOrReadOnly]
    serializer_class = CustomUserSerializer
    
    def get_queryset(self):
        # Fetch the post (using the post ID passed in the URL or any other identifier)
        post_id = self.kwargs.get('post_id')  # Assuming you pass the post ID in the URL
        post = PostTable.objects.get(id=7)
        
        # Get the list of users who liked this post
        likes_list = post.likes.all()
        
        # Return the list of liked users directly, as the serializer works with queryset
        return likes_list
    
    
    
    
    

class ExlplorePostListAPIView(generics.ListAPIView):
    permission_classes =[IsAuthenticatedOrReadOnly]
    serializer_class = PostListSerializer
    
    def get_queryset(self):
        # Query the PostTable where the 'created_by' is in the current user's friends list
        posts = PostTable.objects.all()
        return posts
    
    
    
    
class CommentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer

    def get_queryset(self):
        """
        Optionally filter comments by post_id.
        """
        post_id = self.kwargs.get('post_id')  # This gets the post_id from the URL
        return CommentTable.objects.filter(on_post=post_id)
    
    def list(self, request, post_id=None):
        """
        List all comments for a particular post.
        """
        comments = self.get_queryset()
        serializer = CommentSerializer(comments, many=True,context={'request':request})
        return Response(serializer.data)

    def create(self, request, post_id=None):
        """
        Create a new comment for a particular post.
        """
        serializer = CommentSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            # Assign the current user to the comment
            postinstance= PostTable.objects.get(id = post_id)
            userinstance= CustomUser.objects.get(id = request.user.id)
            print(userinstance)
            
            serializer.save(created_by=userinstance, on_post=postinstance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single comment by its ID.
        """
        comment = CommentTable.objects.get(pk=pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    def destroy(self, request,post_id=None, pk=None):
        """
        Delete a comment only if the user is the owner.
        """
        try:
            comment = CommentTable.objects.get(pk=pk)
        except CommentTable.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if comment.created_by == request.user:
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {"detail": "You do not have permission to delete this comment."},
                status=status.HTTP_403_FORBIDDEN
            )
    

from django.shortcuts import get_object_or_404
from django.db.models import Count
from collections import defaultdict

class StoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = StorySerializer

    def get_queryset(self):
        """
        List all stories, filterable by the user.
        """
        username = self.kwargs.get('username')
       
        user = get_object_or_404(CustomUser, username=username)
        print('getting user strory')
        return StoryTable.objects.filter(created_by__username=username)
    
    def list(self, request,username=None):
        """
        List all stories for all users.
        """
        stories = self.get_queryset()

        # Group stories by date (you can use 'created_date.date()' to group by just the date)
        grouped_stories = defaultdict(list)

        for story in stories:
            # Use only the date part of the `created_date` to group by date
            date_str = story.created_date.date()
            grouped_stories[date_str].append(story)

        # Now we have stories grouped by date
        grouped_data = []
        for date, stories_in_date in grouped_stories.items():
            date_data = {
                'date': date,  # Include the date key
                'stories': StorySerializer(stories_in_date, many=True, context={'request': request}).data
            }
            grouped_data.append(date_data)

        return Response(grouped_data)

    def create(self, request,username=None):
        """
        Create a new story (upload a file).
        """
        serializer = StorySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(created_by=request.user)  # Save the story with the current logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None,username=None):
        """
        Delete a story only if the user is the owner.
        """
        try:
            story = StoryTable.objects.get(pk=pk)
        except StoryTable.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if story.created_by == request.user:
            story.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {"detail": "You do not have permission to delete this story."},
                status=status.HTTP_403_FORBIDDEN
            )