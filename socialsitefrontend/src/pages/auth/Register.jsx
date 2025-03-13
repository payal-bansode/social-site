import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment"; // Import InputAdornment

import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

import { useAlert } from "../../context/AlertContext";
import { useAuth } from "../../context/AuthContext";
import { isExpired } from "react-jwt";

function Register() {
  const { refreshToken } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  // state var for loading
  const [isSubmiting, setIsSubmiting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Single state object to control visibility of all password fields
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  });

  if (refreshToken && !isExpired(refreshToken)) {
    navigate("/"); // Redirect to home if authenticated
  }

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field], // Toggle visibility for the specific field
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match. Please try again.", "error");
      return;
    }

    // Validate username (make sure to handle this as a simple validation)
    const validationUsernameError = validateUsername(formData.username);
    if (validationUsernameError) {
      showAlert(validationUsernameError, "error");
      return;
    }

    // Validate username
    const usernameRegex =
      /^(?!.*[_.-]{2})[a-zA-Z0-9._-]{1,30}(?<![._-])$/; // Only allows letters, numbers, periods, dashes, and underscores
    if (!usernameRegex.test(formData.username)) {
      showAlert(
        "Username can only contain letters, numbers, periods (.), dashes (-), and underscores (_).",
        "error"
      );
      return;
    }
    // Add API call logic here
    try {
      setIsSubmiting(true); // disable the submit button

      const response = await axiosInstance.post("auth/users/", {
        name: formData.fullName,
        email: formData.email, // Use email as username
        username: formData.username,
        password: formData.password,
        re_password: formData.confirmPassword,
      });
      if (response.status === 201) {
        showAlert(
          "Account has been created successfully! Please check your email to activate your account.",
          "success"
        );
      }
    } catch (error) {
      showAlert(error.response?.data || "An unexpected error occurred", "error");
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        minHeight: "100vh", // Full height of the screen
        padding: 2,
      }}
    >
      <Paper
        sx={{
          padding: 3,
          width: "100%",
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
            style={{ width: "60px", height: "60px", marginBottom: "10px", borderRadius: "50%" }}
          />
          <Typography variant="h5" fontWeight="bold">
            Social Site
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Create an account to get started.
          </Typography>
        </Box>

        {/* Registration Form */}
        <Box
          component="form"
          onSubmit={submitRegister}
          sx={{
            display: "grid",
            gap: 2,
          }}
        >
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
          />
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
            type={showPasswords.current ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility("current")} edge="end">
                      {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showPasswords.new ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility("new")} edge="end">
                      {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          {/* Terms and Conditions Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                // checked={formData.termsAccepted}
                // onChange={handleChange}
                name="termsAccepted"
                required
              />
            }
            label={
              <span>
                I agree to the{" "}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  className="custom-link"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </a>
              </span>
            }
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
            disabled={isSubmiting}
          >
            {isSubmiting ? "Submitting..." : "Register"}
          </Button>
        </Box>

        {/* Additional Links */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Already have an account?{" "}
            <Link to="/login" className="custom-link">
              Login
            </Link>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Trouble signing in?{" "}
            <Link to="/resend-activation-link" className="custom-link">
              Activate your account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register;

export const validateUsername = (username) => {
  const forbiddenUsernamesList = [
    "admin",
    "transcription",
    "test",
    "result",
    "leaderboard",
    "login",
    "register",
    "reset-account-password",
    "resend-activation-link",
    "activate-account",
    "about-us",
    "privacy-policy",
    "terms-and-conditions",
    "server-operations",
  ];

  if (forbiddenUsernamesList.includes(username.toLowerCase())) {
    return `The username "${username}" is reserved and cannot be used.`;
  }
  return ""; // Return empty string if username is not forbidden
};
