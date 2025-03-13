import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useAlert } from '../../context/AlertContext';
import axiosInstance from '../../utils/axiosInstance';
import './../../app.css'
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


// THIS FUNCTION IS TO RESEND THE ACCOUNT ACTIVATION LINK TO EMAIL
const ResendActivationAcc = () => {
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({ email: '' });
  const [isLoading, setIsLoading] = useState(false)

  const HandleResendActivationLink = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Send email and password instead of username and password
      const response = await axiosInstance.post('auth/users/resend_activation/', {
        email: formData.email, // Use email as username
      });

      if (response.status === 204) {
        showAlert('Activation link has been sent to the given email.', 'success');
      }

    } catch (error) {
      showAlert(error.response?.data || 'An unexpected error occurred', 'error');

    } finally {
      setIsLoading(false)
    }
  }

  // Setup the form data when changed
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        minHeight: '100vh', // Full height of the screen
        padding: 2,
      }}
    >
      <Paper
        sx={{
          padding: 3,
          width: '100%',
          maxWidth: 400, // Limit max width for better design
          boxShadow: 1, // Light shadow
          borderRadius: 2,
        }}
      >
        {/* Header Section */}
        <Box textAlign="center" sx={{ paddingBottom: 2 }}>
          <img
            src="/assets/img/main-logo.png" // Replace with your logo's path
            alt="Logo"
            style={{ width: "60px", height: "60px", marginBottom: "10px", borderRadius: '50%' }}
          />
          <Typography variant="h5" fontWeight="bold">
            Social Site
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Resend account activation link.
          </Typography>
        </Box>

        {/* Registration Form */}
        <Box
          component="form"
          onSubmit={HandleResendActivationLink}
          sx={{
            display: "grid",
            gap: 2,
          }}
        >

          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              paddingY: 1.2,
            }}
            disabled={isLoading}
          >
            Send Activation Link
          </Button>
        </Box>

        {/* Additional Links */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{" "}
            <Link to="/register" className="custom-link">
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default ResendActivationAcc
