import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../context/AuthContext';  // Assuming your authentication context is set up
import axiosInstance from '../../utils/axiosInstance';

import { useNavigate } from 'react-router-dom';
const CommentList = ({ postId, }) => {
    const { user } = useAuth();  // Get the logged-in user from context
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const navigate = useNavigate()

    const fetchCommentData = async (params) => {

        const response = await axiosInstance.get(`/post/${postId}/comments/`)

        if (response.data){
            setComments(response.data)
        }
        
    }


    // Fetch comments for the specific post
    useEffect(() => {
        // Call an API to fetch comments based on the postId
       fetchCommentData()
    }, [postId]);

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                // Send POST request to add a new comment
                const response = await axiosInstance.post(`post/${postId}/comments/`, {
                    comment: newComment,  // <-- This should match the field name in the model
                    on_post:postId
                });
    
                // Log the response data when the request is successful
                console.log('Comment added successfully:', response.data);
    
                if (response.data) {
                    // If comment was successfully added, fetch updated comment data
                    fetchCommentData();
                }
            } catch (error) {
                // Log any error that occurs during the request
                console.error('Error adding comment:', error);
            }
        }
    };
    
    
    // Handle deleting a comment
    const handleDeleteComment =async (commentId) => {
        // Call API to delete the comment (this is just a placeholder)
        const response = await axiosInstance.delete(`/post/${postId}/comments/${commentId}/`, {
            on_post:postId
        });
        if (response.status ===204){
            fetchCommentData()
        }
    };


    const handleUsernameClick = (username) => {
        // Navigate to the user's profile page
        navigate(`/${username}`);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Comments
            </Typography>
            <List>
                {comments.map((comment) => (
                    <div key={comment.id}>
                        <ListItem><Avatar src={comment.profile_pic} />
                            <ListItemText
                                primary={<Typography
                                    variant="body1"
                                    color="text.primary"
                                    onClick={() => handleUsernameClick(comment.created_by)} // Navigate to username profile
                                    style={{ cursor: 'pointer' }}
                                >
                                    {comment.created_by}
                                </Typography>}
                                secondary={comment.comment}
                            />
                            {comment.created_by === user.username && (
                                <IconButton onClick={() => handleDeleteComment(comment.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            )}
                            
                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>

            <Box display="flex" mt={2}>
                <TextField
                    variant="outlined"
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    sx={{ mr: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                >
                    Add
                </Button>
            </Box>
        </Box>
    );
};

export default CommentList;
