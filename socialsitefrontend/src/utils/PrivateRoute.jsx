import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { hasAccessToken, hasRefreshToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect only if both access and refresh tokens are missing
    if (!hasAccessToken && !hasRefreshToken) {
      navigate('/login');  // Redirect to login if tokens are not available
    }
  }, [hasAccessToken, hasRefreshToken, navigate]);  // Dependency array ensures it runs on token change

  // If authenticated (tokens exist), render the child routes (via <Outlet>)
  if ( hasRefreshToken) {
    return <Outlet />;
  }

  // Otherwise, return null to avoid rendering the outlet if not authenticated (tokens missing)
//   return null;
};

export default PrivateRoute;