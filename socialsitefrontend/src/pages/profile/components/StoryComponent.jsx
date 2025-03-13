import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Box, IconButton, Avatar, TextField } from '@mui/material';
import { Delete as DeleteIcon, ArrowForwardIos as NextIcon, ArrowBackIos as PrevIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add'; // For the "+" icon, or you can use any other icon
import { useAuth } from '../../../context/AuthContext';
const StoryComponent = ({ username }) => {
    const {user} =useAuth()

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [file, setFile] = useState(null);  // To store the selected file
    const [uploading, setUploading] = useState(false);  // To track the upload status
    const [openNewStoryModal, setOpenNewStoryModal] = useState(false);  // State to manage the new story modal

    const fetchStoryList = async () => {
        try {
            const response = await axiosInstance.get(`${username}/stories/`);
            if (response.data) {
                setStories(response.data);  // Set the stories data from the response
                setLoading(false);  // Set loading to false after data is fetched
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
            setLoading(false);  // Ensure loading is set to false if an error occurs
        }
    };

    // Fetch stories when the component mounts or the username changes
    useEffect(() => {
        fetchStoryList();
    }, [username]);

    // Handle file change (file upload)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
        }
    };

    // Handle open modal to view a particular story
    const handleOpenModal = (date, index) => {
        const selected = stories.find(story => story.date === date);
        if (selected) {
            setSelectedStory(selected.stories[index]);
            setCurrentStoryIndex(index);
            setOpenModal(true);
        }
    };

    // Close the modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedStory(null);
        setCurrentStoryIndex(0);
    };

    // Delete story
    const handleDeleteStory = async (id) => {
        try {
            setUploading(true);  // Set uploading state to true while the request is in progress
            const response = await axiosInstance.delete(`${username}/stories/${id}/`);
            if (response.status === 204) {
                fetchStoryList(); // Refresh story list after deletion

                setOpenModal(false)
            }
            setUploading(false);  // Set uploading state to false when done
        } catch (error) {
            console.error('Error uploading story:', error);
            setUploading(false);  // Ensure uploading state is false in case of error
        }
    };

    // Navigate to the next story
    const handleNextStory = () => {
        const nextIndex = (currentStoryIndex + 1) % selectedStory.length;
        setSelectedStory(stories[currentStoryIndex].stories[nextIndex]);
        setCurrentStoryIndex(nextIndex);
    };

    // Navigate to the previous story
    const handlePrevStory = () => {
        const prevIndex = (currentStoryIndex - 1 + selectedStory.length) % selectedStory.length;
        setSelectedStory(stories[currentStoryIndex].stories[prevIndex]);
        setCurrentStoryIndex(prevIndex);
    };

    // Function to upload the new story (image)
    const handleUploadStory = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('story', file); // 'story' is the field name expected by the backend

        try {
            setUploading(true);  // Set uploading state to true while the request is in progress
            const response = await axiosInstance.post(`${username}/stories/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Set the content type to handle file upload
                },
            });
            if (response.data) {
                fetchStoryList(); // Refresh the story list
                setFile(null);  // Clear the file input after upload
            }
            setUploading(false);  // Set uploading state to false when done
        } catch (error) {
            console.error('Error uploading story:', error);
            setUploading(false);  // Ensure uploading state is false in case of error
        }
    };

    // Render Stories grouped by date
    const renderStories = () => {
        return stories.map((dateGroup, idx) => (
            <Box key={idx}>
                {/* <h5>{new Date(dateGroup.date).toLocaleDateString()}</h5> */}
                <Box display="flex" flexDirection="row" flexWrap="wrap">
                    {dateGroup.stories.map((story, index) => (
                        <Box key={story.id} margin={1}>
                            <Avatar
                                alt={story.created_by}
                                src={story.story}
                                sx={{ width: 60, height: 60, cursor: 'pointer' }}
                                onClick={() => handleOpenModal(dateGroup.date, index)}
                            />
                            
                        </Box>
                    ))}
                </Box>
            </Box>
        ));
    };

    return (
        <div>
            <h3>Stories</h3>
            {loading ? (
                <CircularProgress />
            ) : (
                renderStories()
            )}

            {/* Button to open the New Story Modal */}
            {/* <Button variant="contained" color="primary" sx={{ borderRadius: '50%' }} onClick={() => setOpenNewStoryModal(true)}>
                Story
            </Button> */}
            {/* display only for the current user */}
            {
                user.username === username &&
                <Button
                onClick={() => setOpenNewStoryModal(true)}
                variant="contained"
                color="primary"
                sx={{
                    width: 40, // Smaller button width
                    height: 40, // Smaller button height
                    borderRadius: '50%', // Circular button
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 3, // Optional: adds a shadow
                }}
            >
                <AddIcon sx={{ fontSize: 18 }} /> {/* Smaller icon size */}
            </Button>
            }
           


            {/* New Story Modal */}
            <Dialog open={openNewStoryModal} onClose={() => setOpenNewStoryModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload New Story</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <TextField
                            type="file"
                            variant="outlined"
                            fullWidth
                            onChange={handleFileChange}
                            sx={{ mb: 2 }}
                        />
                        {file && (
                            <Avatar
                                alt="Selected Story"
                                src={URL.createObjectURL(file)} // Display the preview using Blob URL
                                sx={{ width: 100, height: 100, mb: 2 }}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadStory} color="primary" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload Story'}
                    </Button>
                    <Button onClick={() => setOpenNewStoryModal(false)} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Story Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Story</DialogTitle>
                <DialogContent>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <IconButton onClick={handlePrevStory} color="primary">
                            <PrevIcon />
                        </IconButton>
                        <img
                            src={selectedStory?.story}
                            alt="Story"
                            style={{ maxHeight: '500px', maxWidth: '100%' }}
                        />

                        <IconButton onClick={handleNextStory} color="primary">
                            <NextIcon />
                        </IconButton>
                        
                    </Box>
                </DialogContent>
                <DialogActions>
                    {user.username === username&&
                    <Button
                    onClick={() => handleDeleteStory(selectedStory?.id)}
                    color="secondary"
                    startIcon={<DeleteIcon />}
                >
                    Delete Story
                </Button>
                    }
                    
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default StoryComponent;
