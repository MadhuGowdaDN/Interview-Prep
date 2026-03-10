import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@common/mui';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const SIDEBAR_WIDTH = 260;

const AppLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
            <CssBaseline />

            <Header
                sidebarWidth={SIDEBAR_WIDTH}
                toggleSidebar={handleDrawerToggle}
            />

            <Sidebar
                sidebarWidth={SIDEBAR_WIDTH}
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Toolbar /> {/* Spacer for fixed header */}

                {/* Page Content Rendered Here via React Router */}
                <Box sx={{ flex: 1, animation: 'fadeIn 0.3s ease-in' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AppLayout;
