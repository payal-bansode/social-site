import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Avatar,
    IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentList from '../../comments/CommentList';

import { useNavigate } from 'react-router-dom'; // React Router for navigation
const PostCard = ({ postDetail, likePost }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate(); // For navigation to the user's profile

    // Function to open modal
    const handleOpen = () => setOpen(true);

    // Function to close modal
    const handleClose = () => setOpen(false);

    // Formatting the created date to a readable format (e.g., "March 8, 2025")
    const formattedDate = new Date(postDetail.created_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const handleUsernameClick = (username) => {
        navigate(`/${username}`); // Navigate to user's profile page using their username
    };

    return (
        <div>
            {/* Card Component for displaying image */}
            <Card
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: 3,
                    '&:hover .overlay': { opacity: 1 },
                    aspectRatio: '1 / 1', // Square aspect ratio
                    cursor: 'pointer',
                }}
                onClick={handleOpen} // Open modal on image click
            >
                <CardMedia
                    component="img"
                    image={postDetail.post}
                    alt={postDetail.description || `Post ${postDetail.id}`}
                    sx={{
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' },
                    }}
                />
            </Card>

            {/* Modal for detailed view */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Post Detail</DialogTitle>
                <DialogContent sx={{ display: 'flex' }}>
                    {/* Left side: Image */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={postDetail.post}
                            alt={postDetail.description || `Post ${postDetail.id}`}
                            style={{ width: '100%', objectFit: 'cover', borderRadius: 8 }}
                        />
                    </Box>

                    {/* Right side: Description, Likes, and Created By */}
                    <Box sx={{ flex: 1, px: 3 }}>
                        <Box sx={{ mt: 2 }}>
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ mt: 2 }}>
                                <Avatar src={postDetail.profile_pic} />
                                <Typography ml={1} variant="h5" sx={{ cursor: 'pointer' }} onClick={() => handleUsernameClick(postDetail.created_by)}>
                                    {postDetail.created_by}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Display the post's creation date */}
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Created on:</strong> {formattedDate}
                            </Typography>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            Description
                        </Typography>
                        {postDetail.description && (
                            <Typography variant="body2">
                                {postDetail.description}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            {/* Displaying the likes */}
                            <FavoriteIcon sx={{ mr: 0.5 }} color='secondary' />
                            <Typography
                                color='secondary'
                                variant="body1"
                                fontWeight="bold"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => likePost(postDetail.id)}
                            >
                                {postDetail.likes.length} like{postDetail.likes.length !== 1 ? 's' : ''}
                            </Typography>
                        </Box>

                        <Box>
                        <CommentList postId={postDetail.id} />
                        </Box>

                        {/* Display the created by username */}

                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default PostCard;
