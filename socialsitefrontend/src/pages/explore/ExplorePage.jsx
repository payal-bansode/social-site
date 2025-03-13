import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { 
  Box, 
  Typography, 
 
  Card, 
  CardMedia, 
 
  Fade 
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Grid from '@mui/material/Grid2';
import PostCard from './components/PostCard';
const ExplorePage = () => {
  const [postList, setPostList] = useState([]);

  const fetchExploreData = async () => {
    try {
      const response = await axiosInstance.get(`/explore/post-list/`);
      setPostList(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching posts:', error.response ? error.response.data : error.message);
    }
  };



  // Update like count after clicking the Like button
  const handleLikeClick = async (postId) => {
    try {
      const response = await axiosInstance.patch(`/post/${postId}/`);
      setPostList((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };



  useEffect(() => {
    fetchExploreData();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Explore
      </Typography>

      {postList.length > 0 ? (
        <Grid container spacing={2}>
          {postList.map((item,index) => (
            <Grid  size={{ xs: 4, sm: 3, md: 2 }} key={item.id}>
                <PostCard postDetail={item} likePost={handleLikeClick}/>
              
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
          No posts available
        </Typography>
      )}
    </Box>
  );
};

export default ExplorePage;