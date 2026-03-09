import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Divider,
    Button,
    IconButton,
    Chip,
    Stack,
    Avatar,
    LinearProgress,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    CircularProgress
} from '@common/mui';
import { ArrowBackIcon, EditIcon, DeleteIcon, PlayIcon, AssessmentIcon, PersonIcon, CalendarIcon, AccessTimeIcon, CheckCircleIcon, CancelIcon, RefreshIcon, EmailIcon } from '@icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getMappingDetails,
    // deleteMapping,
    // updateMapping
} from '@features/mapping/mappingSlice';
import { formatDate } from '@common/utils/dateUtils';
import StatusChip from './StatusChip';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`mapping-tabpanel-${index}`}
            aria-labelledby={`mapping-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const MappingDetailPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [tabValue, setTabValue] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    const { currentMapping, loading: storeLoading } = useSelector((state) => state.mapping);

    useEffect(() => {
        if (id) {
            fetchMappingDetails();
        }
    }, [id]);

    useEffect(() => {
        if (currentMapping) {
            setFormData({
                status: currentMapping.status,
                notes: currentMapping.notes || '',
                scheduledDate: currentMapping.scheduledDate || ''
            });
        }
    }, [currentMapping]);

    const fetchMappingDetails = async () => {
        try {
            await dispatch(getMappingDetails(id)).unwrap();
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to fetch mapping details',
                severity: 'error'
            });
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            // await dispatch(deleteMapping(id)).unwrap();
            // setSnackbar({
            //     open: true,
            //     message: 'Mapping deleted successfully',
            //     severity: 'success'
            // });
            setTimeout(() => {
                navigate('/mapping');
            }, 1500);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to delete mapping',
                severity: 'error'
            });
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            // await dispatch(updateMapping({ id, body: formData })).unwrap();
            setSnackbar({
                open: true,
                message: 'Mapping updated successfully',
                severity: 'success'
            });
            setEditMode(false);
            fetchMappingDetails(); // Refresh data
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to update mapping',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStartAssessment = () => {
        if (currentMapping?.status === 'pending') {
            navigate(`/prepare?mappingId=${id}`);
        } else if (currentMapping?.status === 'completed') {
            navigate(`/mapping/${id}/results`);
        }
    };

    const handleSendReminder = async () => {
        // Implement reminder logic
        setSnackbar({
            open: true,
            message: 'Reminder sent successfully',
            severity: 'success'
        });
    };

    if (storeLoading && !currentMapping) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!currentMapping && !storeLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Mapping Not Found
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/mapping')}
                    sx={{ mt: 2 }}
                >
                    Back to Mappings
                </Button>
            </Box>
        );
    }

    const mapping = currentMapping;
    const user = mapping?.userId || {};
    const assessment = mapping?.assessmentId || {};
    const prepareSession = mapping?.prepareAssessmentId || {};

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <IconButton onClick={() => navigate('/mapping')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" fontWeight={700} color="text.primary">
                            Mapping Details
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            ID: {id}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchMappingDetails}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => setEditMode(!editMode)}
                        >
                            {editMode ? 'Cancel' : 'Edit'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={mapping?.status === 'completed' ? <AssessmentIcon /> : <PlayIcon />}
                            onClick={handleStartAssessment}
                            disabled={mapping?.status === 'started'}
                            color={mapping?.status === 'completed' ? 'success' : 'primary'}
                        >
                            {mapping?.status === 'completed' ? 'View Results' :
                                mapping?.status === 'started' ? 'In Progress' : 'Start Assessment'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Left Column - User & Assessment Info */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        {/* User Card */}
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                                        <PersonIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">User Information</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Assigned Candidate
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Full Name
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {user?.name || 'N/A'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Email Address
                                        </Typography>
                                        <Typography variant="body1">
                                            {user?.email || 'N/A'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Role
                                        </Typography>
                                        <Typography variant="body1">
                                            {user?.role || 'Candidate'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Assessment Card */}
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                                        <AssessmentIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">Assessment Details</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {assessment?.title}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Duration
                                        </Typography>
                                        <Typography variant="body1">
                                            {assessment?.duration || 0} mins
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Questions
                                        </Typography>
                                        <Typography variant="body1">
                                            {assessment?.questions?.length || 0}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Description
                                        </Typography>
                                        <Typography variant="body2">
                                            {assessment?.description || 'No description available'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* Right Column - Mapping Details & Progress */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tabValue} onChange={handleTabChange}>
                                    <Tab label="Overview" />
                                    <Tab label="Progress" />
                                    <Tab label="History" />
                                </Tabs>
                            </Box>

                            {/* Overview Tab */}
                            <TabPanel value={tabValue} index={0}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Mapping Information
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Status
                                                </Typography>
                                                <Box sx={{ mt: 0.5 }}>
                                                    <StatusChip status={mapping?.status} />
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Assigned Date
                                                </Typography>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <CalendarIcon fontSize="small" color="action" />
                                                    <Typography variant="body2">
                                                        {formatDate(mapping?.createdAt, 'full')}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                            {mapping?.scheduledDate && (
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Scheduled For
                                                    </Typography>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <AccessTimeIcon fontSize="small" color="action" />
                                                        <Typography variant="body2">
                                                            {formatDate(mapping.scheduledDate, 'full')}
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            )}
                                            {editMode ? (
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Update Status
                                                    </Typography>
                                                    <select
                                                        value={formData.status}
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="started">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </Box>
                                            ) : (
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Notes
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {mapping?.notes || 'No notes added'}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Quick Actions
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<EmailIcon />}
                                                fullWidth
                                                onClick={handleSendReminder}
                                            >
                                                Send Reminder
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AssessmentIcon />}
                                                fullWidth
                                                onClick={() => navigate(`/assessments/${assessment?._id}`)}
                                            >
                                                View Assessment
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<PersonIcon />}
                                                fullWidth
                                                onClick={() => navigate(`/users/${user?._id}`)}
                                            >
                                                View User Profile
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>

                                {editMode && (
                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleUpdate}
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </Box>
                                )}
                            </TabPanel>

                            {/* Progress Tab */}
                            <TabPanel value={tabValue} index={1}>
                                {prepareSession ? (
                                    <Stack spacing={3}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Assessment Progress
                                                </Typography>
                                                <Box sx={{ mb: 2 }}>
                                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                                        <Typography variant="body2">Overall Completion</Typography>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {prepareSession.progress || 0}%
                                                        </Typography>
                                                    </Stack>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={prepareSession.progress || 0}
                                                        sx={{ height: 8, borderRadius: 4 }}
                                                    />
                                                </Box>
                                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                                    <Grid item xs={4}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Started At
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {formatDate(prepareSession.startedAt, 'MMM DD, YYYY HH:mm')}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Questions Answered
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {prepareSession.answers?.length || 0} / {assessment?.questions?.length || 0}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Time Spent
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {prepareSession.timeSpent || '0 mins'}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>

                                        {prepareSession.answers?.length > 0 && (
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        Recent Answers
                                                    </Typography>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Question</TableCell>
                                                                    <TableCell>Answer</TableCell>
                                                                    <TableCell>Status</TableCell>
                                                                    <TableCell>Time</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {prepareSession.answers.slice(0, 5).map((answer, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>
                                                                            <Tooltip title={answer.question}>
                                                                                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                                                                    {answer.question}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {answer.answer || 'Not answered'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {answer.isCorrect ? (
                                                                                <Chip
                                                                                    size="small"
                                                                                    color="success"
                                                                                    icon={<CheckCircleIcon />}
                                                                                    label="Correct"
                                                                                />
                                                                            ) : (
                                                                                <Chip
                                                                                    size="small"
                                                                                    color="error"
                                                                                    icon={<CancelIcon />}
                                                                                    label="Incorrect"
                                                                                />
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {answer.timeSpent || 'N/A'}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </Stack>
                                ) : (
                                    <Alert severity="info">
                                        No preparation session has been started for this mapping yet.
                                    </Alert>
                                )}
                            </TabPanel>

                            {/* History Tab */}
                            <TabPanel value={tabValue} index={2}>
                                <Stack spacing={2}>
                                    {mapping?.history?.length > 0 ? (
                                        mapping.history.map((event, index) => (
                                            <Card key={index} variant="outlined">
                                                <CardContent>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Box>
                                                            <Typography variant="subtitle2">
                                                                {event.action}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                By: {event.performedBy?.name || 'System'}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDate(event.timestamp, 'full')}
                                                        </Typography>
                                                    </Stack>
                                                    {event.details && (
                                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                                            {event.details}
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <Alert severity="info">
                                            No history events found for this mapping.
                                        </Alert>
                                    )}
                                </Stack>
                            </TabPanel>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Mapping</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this mapping? This action cannot be undone.
                        All associated data will be permanently removed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MappingDetailPage;