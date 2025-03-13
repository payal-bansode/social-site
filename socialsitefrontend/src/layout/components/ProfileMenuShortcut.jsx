import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';

import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import LockResetIcon from '@mui/icons-material/LockReset';

import ResetPasswordDialog from '../../Pages/Auth/ResetPasswordDialog';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';


export default function ProfileMenuShortcut() {
  const { user, logoutUser } = useAuth(); // Fetch the user from context

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null); // No TypeScript annotations
  const open = Boolean(anchorEl);

  const [openResetPasswordDialog, setOpenResetPasswordDialog] = React.useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  // reset password component form auth
  const openResetPassword = () => {
    setOpenResetPasswordDialog(true);
  };

  const closeResetPassword = () => {
    setOpenResetPasswordDialog(false);
  };



  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {/* Check if user has a profile picture, if not display the username */}
            <Avatar sx={{ width: 32, height: 32 }} src={user.profile_pic || undefined}
              alt={user.username}>
              {!user.profile_pic && user.name.charAt(0).toUpperCase()} {/* Display the first letter of the username */}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 50,
                height: 50,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >

        <MenuItem onClick={() => navigate(`${user.username}`)} >
          <Grid container direction="row" sx={{
            justifyContent: "flex-start",
            alignItems: "center",
          }}>
            <Grid size={3} >
              <Avatar sx={{ width: 50, height: 50, p: 0 }} src={user.profile_pic || undefined}
                alt={user.username}>
                {!user.profile_pic && user.name.charAt(0).toUpperCase()} {/* Display the first letter of the username */}
              </Avatar>
            </Grid>
            <Grid size={9} sx={{ px: 2 }}>
              <Grid size={12}>
                <Typography variant="inherit" noWrap>{user.name}</Typography>

              </Grid>
              <Grid size={12}>
                <Typography variant="inherit" color='text.secondary' noWrap>@{user.username}</Typography>

              </Grid >


            </Grid>
          </Grid>

        </MenuItem>
        <Divider />

        <MenuItem onClick={() => navigate(`${user.username}/setting/`)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>


        <MenuItem onClick={() => openResetPassword()}>
          <ListItemIcon>
            <LockResetIcon fontSize="small" />
          </ListItemIcon>
          Reset Password
        </MenuItem>


        <MenuItem onClick={() => (logoutUser())}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* reset password dialogue box */}
      <ResetPasswordDialog open={openResetPasswordDialog}
        onClose={closeResetPassword} />
    </React.Fragment>
  );
}