import axios from 'axios';
import { isExpired } from 'react-jwt';
import { triggerAlertExternally } from '../context/AlertContext';

// Base URL for your API

const API_URL ='http://localhost:8000';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios instance for managing token refresh
const refreshTokenAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Keep track of the refresh process to avoid race conditions
let isRefreshing = false;
let failedRequestsQueue = [];

// Function to add access token to the request
const addAccessTokenToRequest = (config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

// Add request interceptor for adding Authorization header
axiosInstance.interceptors.request.use(addAccessTokenToRequest, (error) => Promise.reject(error));

// Refresh token handling logic
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logoutUser();
      throw new Error('No refresh token found, logging out...');
    }

    const response = await refreshTokenAxios.post('/auth/jwt/refresh/', {
      refresh: refreshToken,
    });

    const { access, refresh } = response.data;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);

    return access; // Return the new access token
  } catch (error) {
    triggerAlertExternally('Session expired. Please log in again.', 'error');
    logoutUser();
    throw error; // Ensure the error is thrown for further handling
  }
};

// Handle token refresh and retry the original request
const retryFailedRequests = (accessToken) => {
  failedRequestsQueue.forEach(({ resolve }) => resolve(accessToken));
  failedRequestsQueue = []; // Clear the queue after retrying
};

// Add response interceptor for handling errors and token expiration
axiosInstance.interceptors.response.use(
  (response) => response, // Return successful responses as is
  async (error) => {
    const originalRequest = error.config;

    // Get tokens from localStorage
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // If the error is 401 and it's not a refresh request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if refresh token is available before trying to refresh the access token
      if (refreshToken) {
        // Check if the access token is expired
        if (isExpired(accessToken)) {
          if (isRefreshing) {
            // Queue the request if a refresh is in progress
            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({ resolve, reject });
            });
          }

          // Mark this request as having a retry to avoid infinite loops
          originalRequest._retry = true;

          isRefreshing = true;
          try {
            const newAccessToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            retryFailedRequests(newAccessToken); // Retry the failed requests with the new token
            return axiosInstance(originalRequest); // Retry the original request with the new token
          } catch (err) {
            return Promise.reject(err); // Handle any errors if token refresh fails
          } finally {
            isRefreshing = false; // Reset the refreshing flag
          }
        } else {
          // If the access token is not expired, propagate the error
          return Promise.reject(error);
        }
      } else {
        // If no refresh token is available, do not attempt refresh and propagate the error
        // console.warn('No refresh token available. Leaving the user logged in.');
        return Promise.reject(error);
      }
    }

    // Handle non-401 errors (or if tokens are valid but the error is unrelated)
    return Promise.reject(error);
  }
);

// Logout user and clear all session data
function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
// Clear user data from localStorage
   // Redirect to login page
}

export default axiosInstance;