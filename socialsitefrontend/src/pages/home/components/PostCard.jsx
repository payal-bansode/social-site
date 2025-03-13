import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardHeader,
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
import { useNavigate } from 'react-router-dom'; // React Router for navigation

import CommentList from '../../comments/CommentList';

const PostCard = ({ postDetail, likePost }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate(); // For navigation to the user's profile

    // Function to open modal
    const handleOpen = () => setOpen(true);

    // Function to close modal
    const handleClose = () => setOpen(false);

    // Formatting the created date (e.g., "March 8, 2025")
    const formattedDate = new Date(postDetail.created_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Handle the username click to navigate to the user's profile
    const handleUsernameClick = (username) => {
        navigate(`/${username}`); // Navigate to user's profile page using their username
    };

    return (
        <div>
            {/* Card Component for displaying image */}
            <Card
                sx={{
                    width: 500,
                    height: 'auto',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: 3,
                    '&:hover .overlay': { opacity: 1 },
                    cursor: 'pointer',
                }}
                onClick={handleOpen} // Open modal on image click
            >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: 'primary.main' }} aria-label="recipe">
                            {postDetail.created_by[0].toUpperCase()} {/* Display first letter of username */}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => handleUsernameClick(postDetail.created_by)} // On username click, navigate to user profile
                        >
                            {postDetail.created_by}
                        </Typography>
                    }
                    subheader={formattedDate}
                />
                <CardMedia
                    component="img"
                    image={postDetail.post}
                    alt={postDetail.description || `Post ${postDetail.id}`}
                    sx={{
                        objectFit: 'cover', // Ensures the image covers the area
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' },
                        height: 'auto', // This makes the image height flexible based on the aspect ratio
                    }}
                />
            </Card>

            {/* Modal for detailed view */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>{postDetail.title || 'Post Detail'}</DialogTitle>
                <DialogContent sx={{ display: 'flex' }}>
                    {/* Left side: Image */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={postDetail.post}
                            alt={postDetail.description || `Post ${postDetail.id}`}
                            style={{ width: '100%', objectFit: 'cover', borderRadius: 8 }}
                        />
                    </Box>

                    {/* Right side: Description & Like Button */}
                    <Box sx={{ flex: 1, px: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Description
                        </Typography>
                        {postDetail.description && (
                            <Typography variant="body2">
                                {postDetail.description}
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FavoriteIcon sx={{ mr: 0.5 }} color="secondary" />
                            <Typography color="secondary"
                                variant="body1"
                                fontWeight="bold"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => likePost(postDetail.id)}
                            >
                                {postDetail.likes.length} like{postDetail.likes.length !== 1 ? 's' : ''} {/* Proper pluralization */}
                            </Typography>
                        </Box>
                        <Box>
                        <CommentList postId={postDetail.id} />
                        </Box>

                        {/* Here, you can later add your comments section or additional content */}
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
