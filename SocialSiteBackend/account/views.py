from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
# Create your views here.

from .models import CustomUser
from .searilizers import CustomUserSerializer,FriendSerializer

from rest_framework import generics

class UserAPIView(APIView):
    """ get the info of single user
    """
    permission_classes=[IsAuthenticatedOrReadOnly]
    
    
    def get(self, request,*args,**kwargs):
        try:
        
            obj = CustomUser.objects.get(username = kwargs['username'])
        except CustomUser.DoesNotExist:
            return Response('user not found !')
        
        serializer =  CustomUserSerializer(obj,context={'request': request})
        
        
        return Response(serializer.data)
    
    
class FriendsAPIView(APIView):
    """ get the friends list of user  
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = FriendSerializer
    
    
    def get(self,request ,*args,**kwargs):
        
        # Get the target user by username from the URL parameter
        try:
            obj = CustomUser.objects.get(username=kwargs['username'])
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Filter out the current logged-in user from the friends list
        # if request.user.username == kwargs['username']:
        #     friends = obj.friends.exclude(id=request.user.id)

        # Serialize the filtered list of friends
        serializer = FriendSerializer(obj.friends.all(), many=True, context={'request': request})

        return Response(serializer.data)
    
    
    # add remove friend
    def post(self, request, *args, **kwargs):
        # Get the current user and the target user by username
        target_user_usernaem = request.user
        try:
            obj = CustomUser.objects.get(username=kwargs['username'])
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as E:
            return Response({"detail": "Server Error"}, status=404)

        # Check if the current user is already a friend
        if target_user_usernaem in obj.friends.all():
            # If already friends, remove the current user from their friends list
            obj.friends.remove(target_user_usernaem)
            message = 'Friend removed'
        else:
            # If not friends, add the current user to their friends list
            obj.friends.add(target_user_usernaem)
            message = 'Friend added'

        # Save the changes
        obj.save()

        # Serialize the updated list of friends
        serializer = FriendSerializer(obj.friends.all(), many=True, context={'request': request})

        # Return the message and the updated list of friends
        return Response({'message': message, 'data': serializer.data})
    
    