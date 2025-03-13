import { Box, Paper, Typography,  } from '@mui/material';

import Button from '@mui/material/Button';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import Avatar from '@mui/material/Avatar';

import ProfileMenuShortcut from './ProfileMenuShortcut';




function CustomAppBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const pages = ['home', 'explore', user ? `${user.username}` : ''];

  const handleNavigation = (page) => {
    // Navigate to root "/" for home, otherwise use page name with slashes
    const path = page === 'home' ? '/' : `/${page}/`;
    navigate(path);
  };


  return (
    <Box
    sx={{
      position: 'fixed', // Fixed positioning like an app bar
      top: 0,
      left: 0,
      right: 0,
      zIndex: 30, // Higher z-index like an app bar
      backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent white background
      backdropFilter: 'blur(5px)', // Optional blur effect for modern look
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      height: '64px', // Standard app bar height
      marginX:4
    }}
  >
    {/* Left Section: Logo and Website Name */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* <LogoIcon sx={{ mr: 1, color: '#1976d2' }} /> Placeholder logo */}
     
        <Typography variant="h6" sx={{ fontWeight: 'bold', }}>
          Social site
        </Typography>
     

    </Box>

    {/* Center Section: Navigation Tabs */}
    <Paper
      elevation={0}
      sx={{
        borderRadius: '25px', // Rounded corners
        // backgroundColor: 'rgb(148, 148, 148)', // Light gray background
        // padding: '4px 8px',
        padding: '0', margin: '0'
      }}
    >
      <Box display={'flex'} flexDirection={'row'} >
        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => handleNavigation(page)}
            sx={{ my: 0,
              // mx: 1,
              display: 'block',
              color: 'text.primary',
              textTransform: 'capitalize',
              // Make the button circular
              borderRadius: '25px', // Fully circular shape
              minWidth: '40px', // Ensures a consistent size (adjust as needed)
              height: '40px', // Matches width for a perfect circle (adjust as needed)
              // Customize hover effect
              '&:hover': {
                backgroundColor: 'rgba(146, 146, 146, 0.3)', // Darker hover effect (adjust opacity or color)
                color: 'text.primary', // Maintain text color on hover (adjust if needed)
                
              },
             }}
          >
            {page}
          </Button>
        ))}

      </Box>

    </Paper>

    {/* Right Section: Profile Icon */}
    <Box >
      {user ? (
        <ProfileMenuShortcut />
        // <h1>logiednuser</h1>
      ) :
        ( // If user doesn't exist, show Avatar or AccountCircleIcon
          <Avatar src="/broken-image.jpg"
            sx={{
              // Use theme's spacing function for height
              cursor: 'pointer',
            }} onClick={() => navigate('/login')}>

          </Avatar>)
      }
    </Box>

  </Box>
  );
}
export default CustomAppBar;
