import React, { createContext, useContext, useState, useEffect, } from 'react';
import axiosInstance from '../utils/axiosInstance';  // Assuming axiosInstance handles automatic token refreshing

// Create Auth Context
const AuthContext = createContext();

// Hook to consume AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // States to store tokens and user data
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken') || null);
  const [user, setUser] = useState( null);  // Persist user object

  // Fetch user data from 'me' endpoint if the access token is present
  const fetchUserData = async () => {
    if (accessToken ) {  // Only fetch if accessToken exists and user data is not available
      try {
        const response = await axiosInstance.get('auth/users/me/');
        setUser(response.data);  // Update the user data in state
        // localStorage.setItem('user', JSON.stringify({'username':response.data.username,}));  // Persist user data in localStorage
      } catch (error) {
        // console.error('Error fetching user data:', error);
        logoutUser();  // Log out if user fetch fails
      }
    }
  };

  // Login function
  const loginUser = (newAccessToken, newRefreshToken) => {
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    console.log( localStorage.setItem('accessToken', newAccessToken))
    // Fetch user data after login
    fetchUserData();
  };

  // Logout function
  const logoutUser = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
     // Remove user data from localStorage
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };



  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    
  };


  // Effect to fetch user data when accessToken changes (on page refresh)
  useEffect(() => {
    if (accessToken) {

      // console.log('refreshing the page')
      fetchUserData();
    }
  }, [accessToken]);  // Only depend on accessToken

  // Listen for changes in localStorage for refreshToken and user
  useEffect(() => {
    const handleStorageChange = () => {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      // const storedUser = localStorage.getItem('user');

      // If the refreshToken is removed from localStorage, log out the user
      if (!storedRefreshToken) {
        logoutUser();
      } else {
        // Update the state if refreshToken is available in localStorage
        setRefreshToken(storedRefreshToken);
      }

    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);  // Empty dependency array ensures this effect is set up once

  // Context value
  const value = {
    loginUser,
    logoutUser,
    accessToken,
    refreshToken,
    user,
    hasAccessToken: Boolean(accessToken),
    hasRefreshToken: Boolean(refreshToken),updateUser,
  };  // Only re-memoize when accessToken, refreshToken, or user changes

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};