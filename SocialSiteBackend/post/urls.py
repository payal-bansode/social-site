from django.urls import path, include
from .views import PostAPIView, PostDetailAPIView, StoryViewSet,HomePostListAPIView, PostLikeListAPIView, ExlplorePostListAPIView, CommentViewSet
from rest_framework.routers import DefaultRouter

# Create a router and register the CommentViewSet
router = DefaultRouter()
# Registering the CommentViewSet correctly using the proper pattern
router.register(r'post/(?P<post_id>\d+)/comments', CommentViewSet, basename='comment')
# Registering the StoryViewSet with username filtering in the URL
# Correctly register the StoryViewSet with the username as a dynamic URL parameter
router.register(r'(?P<username>[\w-]+)/stories', StoryViewSet, basename='user-stories')

# Now include both the manually defined URLs and the router-generated URLs
urlpatterns = [
    path('<str:username>/post/', PostAPIView.as_view()),
    path('post/<int:pk>/', PostDetailAPIView.as_view()),
    path('post/<int:pk>/like-list/', PostLikeListAPIView.as_view()),
    path('home/post-list/', HomePostListAPIView.as_view()),
    path('explore/post-list/', ExlplorePostListAPIView.as_view()),

    # Include the router-generated URLs for CommentViewSet
    path('', include(router.urls)),  # Include the router-generated routes here
    # Manually add the path for the delete action (destroy)
    path('post/<int:post_id>/comments/<int:pk>/', CommentViewSet.as_view({'delete': 'destroy'})),
    
    path('<str:username>/stories/<int:pk>/', StoryViewSet.as_view({'delete': 'destroy'})),
]
