import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

import PostCard from './components/PostCard';

const Home = () => {
  const { user, hasAccessToken } = useAuth(); // Get the user from AuthContext
  const { username } = useParams(); // If needed for dynamic routing
  const [userPostList, setUserPostList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to handle fetching process

  // Fetch posts once the user is available
  const fetchUserPost = async () => {
    

    try {
      const response = await axiosInstance.get(`/home/post-list`);
      setUserPostList(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); // Stop loading when fetching is complete
    }
  };

  useEffect(() => {
   
      fetchUserPost(); // Fetch posts when user is available and has access token
  
  }, []); // Trigger effect when user or access token changes

  const handleLikeClick = async (postId) => {
    try {
      // Make a PATCH request to like the post
      const response = await axiosInstance.patch(`/post/${postId}/`);
      // Update the post's likes count in the UI automatically based on the server response
      setUserPostList((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: response.data.likes } // Update the likes count from the server
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error.response ? error.response.data : error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator until user posts are fetched
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid display={'flex'} spacing={3} flexDirection={'column'} justifyContent={'center'} 
      alignItems={'center'} container >
        {userPostList?.map((post) => (
          <Grid display={'flex'}  justifyContent={'center'} size={12} key={post.id}>

            <PostCard postDetail={post} likePost={handleLikeClick}/>
          
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
