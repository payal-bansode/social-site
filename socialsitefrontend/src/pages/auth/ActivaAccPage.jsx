import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useAlert } from '../../context/AlertContext';

const ActivaAccPage = () => {
  const { uid, token } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  // State to track if the account has been activated
  const [activated, setActivated] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const SubmitActivateAcc = async (e) => {
    console.log('uid:', uid, 'token:', token);

    try {
      // disable the account activation button when submitting form
      setIsSubmiting(true);

      // Send UID and token to activate the account
      const response = await axiosInstance.post('auth/users/activation/', {
        uid: uid,
        token: token,
      });

      if (response.status === 204) {
        setActivated(true); // Update state to show login button
        showAlert('Account activated successfully!', 'success');
      }
    } catch (error) {
      showAlert(error.response?.data || 'An unexpected error occurred', 'error');
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        minHeight: '100vh', // Make sure it's full height of the viewport
        padding: 2,
      }}
    >
      <Paper
        sx={{
          padding: 3,
          width: '100%',
          maxWidth: 400, // Limit the max width to make it look good
          boxShadow: 1, // Box shadow level 1 (light shadow)
          borderRadius: 2,
        }}
      >
        {/* Header Section */}
        <Box textAlign="center" sx={{ paddingBottom: 2 }}>
          <img
            src="/assets/img/main-logo.png" // Replace with your logo's path
            alt="Logo"
            style={{ width: '60px', height: '60px', marginBottom: '10px', borderRadius: '50%' }}
          />
          <Typography variant="h5" fontWeight="bold">
            social site
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Activate your account to get started.
          </Typography>
        </Box>

        {/* Show the "Activate" button if the account isn't activated yet */}
        {!activated ? (
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              paddingY: 1.2,
            }}
            disabled={isSubmiting}
            onClick={SubmitActivateAcc}
          >
            Click here to activate
          </Button>
        ) : (
          // Once activated, show the "Login" button
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              paddingY: 1.2,
            }}
            onClick={() => {
              navigate('/login');
            }}
          >
            Click here to login
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default ActivaAccPage;
