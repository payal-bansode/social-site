import React from 'react'
import { styled,  } from '@mui/material/styles';
import { Outlet } from 'react-router-dom'

import { Box } from '@mui/material'
import CustomAppBar from './components/CustomAppBar'
import CssBaseline from '@mui/material/CssBaseline';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    backgroundColor:'#FFFFFF'
  }));
  

const Layout = () => {
    return (
        <div>
            <Box sx={{ display: 'flex' }}>
            <CssBaseline /> 
                <CustomAppBar/>

                <Box component="main" sx={{ flexGrow: 1, p: 0, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
                    {/* Conditionally render DrawerHeader only if not on homepage */}
                    <DrawerHeader sx={{ backgroundColor: "#f9f9f9",   }} />
                    <Outlet />

                </Box>
            </Box>

        </div>
    )
}

export default Layout
