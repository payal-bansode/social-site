import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import {  Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
export default function PhotoPreview({ image, description, user, comments }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open Photo Preview
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md" // Adjust width of the dialog
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Photo Preview</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Left Side: Image */}
            <Grid  xs={12} md={6}>
              <Box
                component="img"
                src={image} // Pass the image URL here
                alt="Preview"
                sx={{
                //   width: '100%',
                  width: 300,
                  maxWidth:300,
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            </Grid>

            {/* Right Side: Content/Description */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" component="h2">
                {user && user.name} {/* Display the name of the user who uploaded */}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {description} {/* Display the description */}
              </Typography>

              {/* Display Comments or additional content */}
              {comments && comments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" component="h3">
                    Comments:
                  </Typography>
                  {comments.map((comment, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>{comment.user}:</strong> {comment.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
