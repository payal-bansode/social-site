import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import axiosInstance from '../../../utils/axiosInstance';
import { useAuth } from '../../../context/AuthContext';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function AddPost({ refreshPosts }) {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = React.useState({
    description: '',
  });
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null); // For previewing the image

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file); // Create a Blob URL for preview
      setPreview(objectUrl); // Set the Blob URL as the preview
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPost = async () => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('description', formData.description);

    if (selectedFile) {
      formDataToSubmit.append('post', selectedFile);
    }

    try {
      const response = await axiosInstance.post(`/${user.username}/post/`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure we're sending the correct content type
        },
      });

      // Handle the response (e.g., success message, resetting form, etc.)
      console.log('Post created successfully:', response.data);
      setPreview(null);
      setFormData({ description: '' });
      setOpen(false); // Close the dialog on successful post creation

      // Call the refreshPosts function passed as prop
      refreshPosts(); // Trigger a refetch of the posts
    } catch (error) {
      // Error handling
      console.error('Error creating post:', error.response ? error.response.data : error.message);
      // Optionally show an alert or display an error message
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Post
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Create a New Post"}
        </DialogTitle>
        <DialogContent>
          {/* File Upload Button */}
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload Files
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileChange}
              multiple
            />
          </Button>

          {/* File Preview (optional) */}
          {preview && <img src={preview} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />}

          {/* Description Textarea */}
          <textarea
            value={formData.description}
            name="description"
            onChange={handleInputChange}
            placeholder="Write a description..."
            rows="4"
            style={{ width: '100%', marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmitPost} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
