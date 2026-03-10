import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@common/mui';
import { AssignmentIcon, DashboardIcon, MapIcon, PlayIcon } from '@icons';
import { useLocation, useNavigate } from 'react-router-dom';

const NAVIGATION = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/' },
    { text: 'Assessments', icon: <AssignmentIcon />, path: '/assessments' },
    { text: 'Mappings', icon: <MapIcon />, path: '/mapping' },
    { text: 'Live Prep', icon: <PlayIcon />, path: '/prepare' },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle, sidebarWidth }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#0F172A', // Slate 900
                color: '#F8FAFC', // Slate 50
                boxShadow: '4px 0 24px rgba(0,0,0,0.08)'
            }}
        >
            <Box sx={{ p: 4, display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        backgroundColor: '#3B82F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" color="white">E</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                    ENTERPRISE
                </Typography>
            </Box>

            <Box sx={{ px: 3, mb: 1 }}>
                <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: '1px' }}>
                    Main Menu
                </Typography>
            </Box>

            <List sx={{ px: 2, flex: 1 }}>
                {NAVIGATION.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    if (mobileOpen) handleDrawerToggle();
                                }}
                                sx={{
                                    borderRadius: '10px',
                                    py: 1.2,
                                    px: 2,
                                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                    color: isActive ? '#60A5FA' : '#94A3B8',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                        color: '#F8FAFC',
                                        '& .MuiListItemIcon-root': {
                                            color: '#60A5FA',
                                        }
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? '#3B82F6' : '#64748B',
                                        minWidth: 40,
                                        transition: 'color 0.2s ease',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1E293B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2
                }}>
                    <Typography variant="subtitle2" color="white">JD</Typography>
                </Box>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                        John Doe
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Admin User
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { md: sidebarWidth }, flexShrink: { md: 0 } }}>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth, borderRight: 'none' },
                }}
            >
                {drawerContent}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth, borderRight: 'none' },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
