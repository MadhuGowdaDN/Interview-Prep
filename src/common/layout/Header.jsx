import { Avatar, Badge, Box, IconButton, InputBase, AppBar as MuiAppBar, Toolbar, Typography, alpha } from '@common/mui';
import { ArrowDownIcon, MenuIcon, NotificationsIcon, SearchIcon } from '@icons';

const Header = ({ sidebarWidth, toggleSidebar }) => {
    return (
        <MuiAppBar
            position="fixed"
            elevation={0}
            sx={{
                width: { md: `calc(100% - ${sidebarWidth}px)` },
                ml: { md: `${sidebarWidth}px` },
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                color: 'text.primary',
            }}
        >
            <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleSidebar}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Search Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: alpha('#F1F5F9', 0.8),
                        borderRadius: '12px',
                        px: 2,
                        py: 0.5,
                        width: { xs: '100%', md: '360px' },
                        border: '1px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: '#F1F5F9',
                            borderColor: '#E2E8F0'
                        }
                    }}
                >
                    <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    <InputBase
                        placeholder="Search assessments, users..."
                        sx={{ width: '100%', fontSize: '0.9rem' }}
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* Right Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '10px',
                            color: 'text.secondary'
                        }}
                    >
                        <Badge badgeContent={3} color="error" variant="dot">
                            <NotificationsIcon fontSize="small" />
                        </Badge>
                    </IconButton>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 0.5,
                            pr: 1.5,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                        }}
                    >
                        <Avatar
                            sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}
                        >
                            JD
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" fontWeight={600} lineHeight={1.2}>John Doe</Typography>
                            <Typography variant="caption" color="text.secondary">Admin</Typography>
                        </Box>
                        <ArrowDownIcon fontSize="small" color="action" />
                    </Box>
                </Box>
            </Toolbar>
        </MuiAppBar>
    );
};

export default Header;
