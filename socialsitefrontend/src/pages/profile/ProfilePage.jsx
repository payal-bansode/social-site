import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Make sure to use this if needed
import axiosInstance from '../../utils/axiosInstance';

import AddPost from './components/AddPost';
import ListPost from './components/ListPost';

import { Box, Typography, Avatar, Divider, Button } from '@mui/material';
import Grid from '@mui/material/Grid2'
import FriendsList from './components/FriendsList';

import StoryComponent from './components/StoryComponent';

const ProfilePage = () => {

  const { user } = useAuth()

  const { username } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userPostList, setUserPostList] = useState([]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get(`/${username}`); // Ensure correct endpoint URL
      setUserDetails(response.data);
      console.log(response.data);
    } catch (error) {
      // Handle error case
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          // If user is not found, handle it
          showAlert('User not found', 'error');
        } else {
          // Default error message
          showAlert(error.response.data, 'error');
        }
      } else {
        // Fallback error
        showAlert('Something went wrong, please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Fetch posts
  const fetchUserPost = async () => {
    try {
      const response = await axiosInstance.get(`/${username}/post/`);
      setUserPostList(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error.response ? error.response.data : error.message);
    }
  };




  // Update like count after clicking the Like button
  const handleLikeClick = async (postId) => {
    try {
      const response = await axiosInstance.patch(`/post/${postId}/`);
      setUserPostList((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle follow button click (if not the logged-in user)
  const handleFollowClick = async () => {
    console.log(`Adding ${username} to the friend list.`);
    // Here you can implement the logic to add the user to the friend's list.
    try {
      const response = await axiosInstance.post(`/${username}/friends/`,

      );
      if (response.status === 200) {
        fetchUserProfile();
        fetchUserPost();

      }

    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };
  // Handle follow button click (if not the logged-in user)
  const deletePostFunc = async (postId) => {
    console.log(`${postId} deleting post`);
    // Here you can implement the logic to add the user to the friend's list.
    try {
      const response = await axiosInstance.delete(`/post/${postId}/`,

      );
      if (response.status === 204) {
        fetchUserProfile();
        fetchUserPost();

      }

    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
    fetchUserPost();
  }, [username]);


  const refreshPosts = () => {
    fetchUserPost();  // Refresh the profile data and posts
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!userDetails) {
    return <p>No user found!</p>;
  }

  return (
    <Box sx={{ maxWidth: 935, mx: 'auto', mt: 4, px: 2 }}>
      {/* Profile Header */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid size={{ xs: 4, md: 3 }}>
          <Avatar
            src={userDetails.profile_pic}
            alt={userDetails.username}
            sx={{
              width: { xs: 77, md: 150 },
              height: { xs: 77, md: 150 },
              border: '2px solid #fff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
            }}
          />
        </Grid>
        <Grid size={{ xs: 8, md: 9 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 300, mr: 2 }}>
              {userDetails.username}
            </Typography>
            {/* Conditionally render the Follow button */}
            {user.username !== username && (
              <Button
                variant={"outlined"}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  // color: '#262626',
                  borderColor: '#dbdbdb',
                }}
                color={userDetails.is_friend ? 'error' : 'info'}
                onClick={handleFollowClick}
              >
                {userDetails.is_friend ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 4, mb: 2, flexDirection: 'row' }}>
            <Typography variant="body1">
              <strong>{userPostList.length}</strong> posts
            </Typography>
            <Typography variant="body1" display={'flex'} flexDirection={'row'}>
              {userDetails.friends}
              <FriendsList username={username} />
            </Typography>

          </Box>

          {/* Bio */}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {userDetails.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {userDetails.headline}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {userDetails.address}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {userDetails.gender} | Public: {userDetails.is_public ? 'Yes' : 'No'}
          </Typography>
        </Grid>
      </Grid> 

      <StoryComponent username={username} />

      <Divider sx={{ mb: 4 }} />

      {/* Add Post Section */}
      {user.username === username && (

        <AddPost refreshPosts={refreshPosts} />)
      }


      {/* Posts Grid */}
      <Grid container spacing={2}>
        {userPostList?.length === 0 ? (
          // No posts available message
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ textAlign: 'center', mt: 4 }}
            >
              No content is available for this person.
            </Typography>
          </Grid>
        ) : (
          // Render the posts if available
          userPostList?.map((post) => (
            <Grid size={{ xs: 2, sm: 3, md: 3 }} key={post.id}>
              {/* Render the PostCard for each post */}
              <ListPost postDetail={post} likePost={handleLikeClick} deletePostFunc={deletePostFunc} />
            </Grid>
          ))
        )}
      </Grid>


    </Box>
  );
};

export default ProfilePage;
