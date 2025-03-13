import React, { createContext, useState, useContext, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Error as ErrorIcon, CheckCircle as SuccessIcon, Info as InfoIcon, Warning as WarningIcon } from '@mui/icons-material';

// Create a context for the alert system
const AlertContext = createContext();

// Global reference to showAlert function
let externalShowAlert = null;

// Expose the global showAlert function
export const setExternalShowAlert = (showAlertFunc) => {
  externalShowAlert = showAlertFunc;
};

// Function to trigger an alert externally
export const triggerAlertExternally = (error, severity = 'error') => {
  if (externalShowAlert) {
    // Try to extract the "detail" field from the error object if it exists
    const message = getErrorDetail(error) || formatErrorMessage(error); // Fallback to full formatting if "detail" is not present
    externalShowAlert(message, severity);
  }
};

// Helper function to recursively find "detail" from the error object
const getErrorDetail = (error) => {
  if (typeof error === 'object' && error !== null) {
    if (error.detail) {
      return error.detail; // Return the "detail" directly if it's available
    }
    
    // Recursively check nested objects for "detail"
    for (const key in error) {
      if (error.hasOwnProperty(key)) {
        const nestedDetail = getErrorDetail(error[key]);
        if (nestedDetail) {
          return nestedDetail; // Return the first "detail" we find
        }
      }
    }
  }
  return null; // Return null if no "detail" is found
};

// Helper function to format error messages
const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    if (/<\/?[a-z][\s\S]*>/i.test(error)) {
      return 'An error occurred. Please try again later.'; // Generic message for HTML content
    }
    return error; // Direct string error message
    // return error; // Direct string error message
  }

  if (Array.isArray(error)) {
    return error.join(' '); // Join array elements with space
  }

  if (typeof error === 'object' && error !== null) {
    // Handle nested error objects
    return Object.entries(error)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}: ${value}`;
        }
        if (Array.isArray(value)) {
          return `${key}: ${value.join(', ')}`;
        }
        if (typeof value === 'object') {
          return `${key}: ${formatErrorMessage(value)}`;
        }
        return key;
      })
      .join(' | '); // Join individual messages with a separator
  }

  return 'An unexpected error occurred'; // Default fallback
};

// Define custom icons for each alert type
const getAlertIcon = (severity) => {
  switch (severity) {
    case 'success':
      return <SuccessIcon style={{ color: 'green' }} />;
    case 'info':
      return <InfoIcon style={{ color: 'blue' }} />;
    case 'warning':
      return <WarningIcon style={{ color: 'orange' }} />;
    case 'error':
    default:
      return <ErrorIcon style={{ color: 'red' }} />;
  }
};

// AlertProvider component
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  // Function to display the alert
  const showAlert = (error, severity = 'error') => {
    // Process the error before showing the alert
    const formattedMessage = getErrorDetail(error) || formatErrorMessage(error);
    setAlert({ message: formattedMessage, severity });
    setTimeout(() => setAlert(null), 5000); // Auto-hide alert after 5 seconds
  };

  // Set the global showAlert function when the component mounts
  useEffect(() => {
    setExternalShowAlert(showAlert);
  }, [showAlert]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <Snackbar open={Boolean(alert)} autoHideDuration={5000}>
          <Alert
            severity={alert.severity}
            sx={{ width: '100%' }}
            icon={getAlertIcon(alert.severity)}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </AlertContext.Provider>
  );
};

// Custom hook to use the alert context
export const useAlert = () => useContext(AlertContext);