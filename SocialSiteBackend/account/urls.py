from django.urls import path,include

from .views import FriendsAPIView, UserAPIView

# Add the user endpoint
urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')), 
    
    path('<str:username>/', UserAPIView.as_view()),
    path('<str:username>/friends/', FriendsAPIView.as_view()),
]

