import React, { useState } from 'react';
import { isExpired } from 'react-jwt';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Login = () => {
  const { loginUser, refreshToken } = useAuth();
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (refreshToken && !isExpired(refreshToken)) {
    navigate('/'); // Redirect to home if authenticated
  }

  // handle the form changes with its values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Send email and password instead of username and password
      const response = await axiosInstance.post('auth/jwt/create/', {
        email: formData.email, // Use email as username
        password: formData.password,
      });

      const { refresh, access } = response.data;

      loginUser(access, refresh);
      navigate('/');

    } catch (error) {
      showAlert(error.response?.data || 'An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
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
            style={{ width: '60px', height: '60px', marginBottom: '10px', borderRadius: '50%' }}
          />
          <Typography variant="h5" fontWeight="bold">
            Social Site
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Login with an account to get started.
          </Typography>
        </Box>

        {/* Registration Form */}
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: 'grid',
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

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
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
              textTransform: 'none',
              fontWeight: 'bold',
              paddingY: 1.2,
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Login'}
          </Button>

          {/* link for forget password */}
          <Typography variant="body2" color="textSecondary">
            <Link to="/reset-account-password" className="custom-link">
              Forget Password?
            </Link>
          </Typography>
        </Box>

        {/* Additional Links */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <Link to="/register" className="custom-link">
              Register
            </Link>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Trouble signing in?{' '}
            <Link to="/resend-activation-link" className="custom-link">
              Activate your account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
