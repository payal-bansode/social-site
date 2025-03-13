import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { useAlert } from '../../context/AlertContext';
import { useParams } from 'react-router-dom';
import './../../app.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment'; // Import InputAdornment


// THIS FUNCTION IS TO RESET THE ACCOUNT PASSWORD
const ResetAccountPass = () => {
    const { showAlert } = useAlert();
    // this is form for giving the user setpassworf email form
    const [formData, setFormData] = useState({ email: '' });

    // this is for user to add his new password fields
    const [resetFormData, setRestFormData] = useState({ password1: '', password2: '' });

    // fetch the uid token from the url param to checke whether user want to change passwrd or not
    const { uid, token } = useParams();

    // this is the form to give user to add his new password for password change
    const [isAddPasswordReset, setAddIsPasswordReset] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false); // State to track button disable

    // Single state object to control visibility of all password fields
    const [showPasswords, setShowPasswords] = useState({
        new1: false,
        new2: false,
    });

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPasswords(prevState => ({
            ...prevState,
            [field]: !prevState[field], // Toggle visibility for the specific field
        }));
    };

    //GET THE UID , TOKEN TO VERIFY THE USER WITH BUTTON CLICK
    useEffect(() => {
        // Check if token and resetId are present to render password reset form
        if (uid && token) {
            setAddIsPasswordReset(true);
        }
    }, [uid, token]);

    //  handle form value changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // this is to update the new password state form
        if (isAddPasswordReset) {
            setRestFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));

        }
        // this is to update the state of email to change password
        else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // THIS FUNCTION IS TO SUBMIT NEW PASSWORDS WHEN THE TOKEN AND UID RECEIVED AND THE LINK RECEIVED
    const SubmitNewPassword = async (e) => {
        e.preventDefault();
        console.log(resetFormData.password1, resetFormData.password2);
        // Disable the button when the request starts
        if (resetFormData.password1 !== resetFormData.password2) {
            showAlert("Passwords do not match. Please try again.", "error");
            return;
        }
        try {
            setIsSubmitting(true);
            // Send email and password instead of username and password
            const response = await axiosInstance.post('auth/users/reset_password_confirm/', {
                uid: uid, // Use email as username
                token: token,
                new_password: resetFormData.password1,
                re_new_password: resetFormData.password2,
            });

            if (response.status === 204) {
                showAlert('Password has been reset successfully!', 'success');
            }
        } catch (error) {
            showAlert(error.response?.data || 'An unexpected error occurred', 'error');
        } finally {
            setIsSubmitting(false); // Re-enable button after response or error
        }
    };

    // THIS FUNCTION WIL TAKE THE USER EMAIL AND SEND TO SERVER TO RECEIVE LINK TO RESET PASSWORD
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Disable button before submitting
        try {
            // Send email and password instead of username and password
            const response = await axiosInstance.post('auth/users/reset_password/', {
                email: formData.email, // Use email as username
            });

            if (response.status === 204) {
                showAlert('A password reset link has been sent to your email.', 'success');
            }
        } catch (error) {
            showAlert(error.response?.data || 'An unexpected error occurred', 'error');
        } finally {
            setIsSubmitting(false); // Re-enable button after response or error
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
                        style={{ width: "60px", height: "60px", marginBottom: "10px", borderRadius: '50%' }}
                    />
                    <Typography variant="h5" fontWeight="bold">
                        Social Site
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Reset your password
                    </Typography>
                </Box>

                {isAddPasswordReset ? (
                    <Box component="form" onSubmit={SubmitNewPassword} sx={{ display: "grid", gap: 2 }}>
                        <TextField
                            label="New Password"
                            name="password1"
                            type={showPasswords.new1 ? 'text' : 'password'}
                            value={resetFormData.password1}
                            onChange={handleChange}
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => togglePasswordVisibility('new1')}
                                                edge="end"
                                            >
                                                {showPasswords.new1 ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <TextField
                            label="Confirm Password"
                            name="password2"
                            type={showPasswords.new2 ? 'text' : 'password'}
                            value={resetFormData.password2}
                            onChange={handleChange}
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => togglePasswordVisibility('new2')}
                                                edge="end"
                                            >
                                                {showPasswords.new2 ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{ textTransform: "none", fontWeight: "bold", paddingY: 1.2 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Box mt={2} textAlign="center">
                            <Typography variant="body2" color="textSecondary">
                                Already have an account?{" "}
                                <Link to="/login" className="custom-link">
                                    Login
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleResetPassword} sx={{ display: "grid", gap: 2 }}>
                        <TextField
                            label="Registered Email Address"
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
                            sx={{ textTransform: "none", fontWeight: "bold", paddingY: 1.2 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Box mt={2} textAlign="center">
                            <Typography variant="body2" color="textSecondary">
                                Already have an account?{" "}
                                <Link to="/login" className="custom-link">
                                    Login
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ResetAccountPass;
