import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@common/mui';
import { PeopleIcon, AssessmentIcon, TrendingUpIcon, TimelineIcon } from '@icons';

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <Box
            sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                opacity: 0.1,
                transform: 'scale(2.5)',
                color: `${color}.main`
            }}
        >
            {icon}
        </Box>
        <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom fontWeight={600} textTransform="uppercase">
                {title}
            </Typography>
            <Typography variant="h3" component="div" fontWeight={700} sx={{ mt: 2, color: 'text.primary' }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const DashboardPage = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
                    Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome back. Here is your system summary.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Users" value="1,248" icon={<PeopleIcon />} color="primary" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Assessments" value="84" icon={<AssessmentIcon />} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Completion Rate" value="92%" icon={<TrendingUpIcon />} color="info" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Active Sessions" value="312" icon={<TimelineIcon />} color="warning" />
                </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ mt: 1 }}>
                {/* Placeholder for future Charts / Complex data */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">Analytics Chart Placeholder</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">Recent Activity Feed</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;
