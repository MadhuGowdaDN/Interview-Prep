import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Alert,
    Snackbar,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    Divider,
    IconButton,
    Autocomplete,
    Chip,
    Stack,
    InputAdornment,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@common/mui';
import { ArrowBackIcon, SaveIcon, PersonIcon, AssessmentIcon, CheckCircleIcon } from '@icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createMapping } from '@features/mapping/mappingSlice';

// Mock data for users and assessments (replace with actual API calls)
const MOCK_USERS = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'candidate' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'candidate' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'candidate' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'candidate' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'candidate' },
];

const MOCK_ASSESSMENTS = [
    {
        id: 101,
        title: 'Senior Frontend Developer Assessment',
        duration: 120,
        questions: 25,
        difficulty: 'Advanced',
        description: 'Comprehensive assessment for senior frontend roles'
    },
    {
        id: 102,
        title: 'Backend Node.js Challenge',
        duration: 90,
        questions: 20,
        difficulty: 'Intermediate',
        description: 'Node.js backend development assessment'
    },
    {
        id: 103,
        title: 'Full Stack Developer Test',
        duration: 150,
        questions: 30,
        difficulty: 'Advanced',
        description: 'Full stack development with React and Node.js'
    },
    {
        id: 104,
        title: 'DevOps Engineer Assessment',
        duration: 60,
        questions: 15,
        difficulty: 'Intermediate',
        description: 'Docker, Kubernetes, and CI/CD assessment'
    },
    {
        id: 105,
        title: 'Database Design Quiz',
        duration: 45,
        questions: 12,
        difficulty: 'Beginner',
        description: 'SQL and database design principles'
    },
];

const steps = ['Select User', 'Select Assessment', 'Review & Confirm'];

const CreateMappingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        userId: '',
        assessmentId: '',
        scheduledDate: '',
        notes: '',
        sendInvitation: true
    });

    // Search states
    const [userSearch, setUserSearch] = useState('');
    const [assessmentSearch, setAssessmentSearch] = useState('');

    // Selected items
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAssessment, setSelectedAssessment] = useState(null);

    // Validation errors
    const [errors, setErrors] = useState({});

    const handleNext = () => {
        if (validateStep()) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const validateStep = () => {
        const newErrors = {};

        if (activeStep === 0) {
            if (!selectedUser) {
                newErrors.user = 'Please select a user';
            }
        } else if (activeStep === 1) {
            if (!selectedAssessment) {
                newErrors.assessment = 'Please select an assessment';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!selectedUser || !selectedAssessment) {
            setSnackbar({
                open: true,
                message: 'Please select both user and assessment',
                severity: 'error'
            });
            return;
        }

        setLoading(true);

        const mappingData = {
            userId: selectedUser.id,
            assessmentId: selectedAssessment.id,
            userName: selectedUser.name,
            userEmail: selectedUser.email,
            assessmentName: selectedAssessment.title,
            status: 'pending',
            scheduledDate: formData.scheduledDate || new Date().toISOString(),
            notes: formData.notes,
            createdAt: new Date().toISOString()
        };

        try {
            // Dispatch create mapping action
            const result = await dispatch(createMapping({ body: mappingData })).unwrap();

            setSnackbar({
                open: true,
                message: 'Assessment mapping created successfully!',
                severity: 'success'
            });

            // Navigate back to listing after short delay
            setTimeout(() => {
                navigate('/mapping');
            }, 1500);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to create mapping',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/mapping');
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Select User
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Choose the user who will take this assessment
                        </Typography>

                        <Autocomplete
                            options={MOCK_USERS}
                            getOptionLabel={(option) => `${option.name} (${option.email})`}
                            value={selectedUser}
                            onChange={(event, newValue) => {
                                setSelectedUser(newValue);
                                if (newValue) {
                                    setFormData({ ...formData, userId: newValue.id });
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Users"
                                    variant="outlined"
                                    error={!!errors.user}
                                    helperText={errors.user}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <PersonIcon color="action" />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Box>
                                        <Typography variant="body2" fontWeight={500}>
                                            {option.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {option.email} • {option.role}
                                        </Typography>
                                    </Box>
                                </li>
                            )}
                        />

                        {selectedUser && (
                            <Card variant="outlined" sx={{ mt: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Selected User Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Name
                                            </Typography>
                                            <Typography variant="body2">
                                                {selectedUser.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body2">
                                                {selectedUser.email}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Select Assessment
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Choose the assessment to assign
                        </Typography>

                        <Autocomplete
                            options={MOCK_ASSESSMENTS}
                            getOptionLabel={(option) => option.title}
                            value={selectedAssessment}
                            onChange={(event, newValue) => {
                                setSelectedAssessment(newValue);
                                if (newValue) {
                                    setFormData({ ...formData, assessmentId: newValue.id });
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Assessments"
                                    variant="outlined"
                                    error={!!errors.assessment}
                                    helperText={errors.assessment}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <AssessmentIcon color="action" />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="body2" fontWeight={500}>
                                            {option.title}
                                        </Typography>
                                        <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                                            <Typography variant="caption" color="text.secondary">
                                                Duration: {option.duration} mins
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Questions: {option.questions}
                                            </Typography>
                                            <Chip
                                                label={option.difficulty}
                                                size="small"
                                                color={
                                                    option.difficulty === 'Advanced' ? 'error' :
                                                        option.difficulty === 'Intermediate' ? 'warning' : 'success'
                                                }
                                                variant="outlined"
                                            />
                                        </Stack>
                                    </Box>
                                </li>
                            )}
                        />

                        {selectedAssessment && (
                            <Card variant="outlined" sx={{ mt: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Assessment Details
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {selectedAssessment.description}
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" color="text.secondary">
                                                Duration
                                            </Typography>
                                            <Typography variant="body2">
                                                {selectedAssessment.duration} minutes
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" color="text.secondary">
                                                Questions
                                            </Typography>
                                            <Typography variant="body2">
                                                {selectedAssessment.questions}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" color="text.secondary">
                                                Difficulty
                                            </Typography>
                                            <Chip
                                                label={selectedAssessment.difficulty}
                                                size="small"
                                                color={
                                                    selectedAssessment.difficulty === 'Advanced' ? 'error' :
                                                        selectedAssessment.difficulty === 'Intermediate' ? 'warning' : 'success'
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Review & Confirm
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Please review the mapping details before confirming
                        </Typography>

                        <Card variant="outlined" sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    User Information
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Name
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedUser?.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedUser?.email}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                    <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Assessment Information
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {selectedAssessment?.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {selectedAssessment?.description}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" color="text.secondary">
                                            Duration
                                        </Typography>
                                        <Typography variant="body2">
                                            {selectedAssessment?.duration} mins
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" color="text.secondary">
                                            Questions
                                        </Typography>
                                        <Typography variant="body2">
                                            {selectedAssessment?.questions}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" color="text.secondary">
                                            Difficulty
                                        </Typography>
                                        <Typography variant="body2">
                                            {selectedAssessment?.difficulty}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Additional Notes (Optional)"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Schedule (Optional)</InputLabel>
                            <Select
                                value={formData.scheduledDate}
                                label="Schedule (Optional)"
                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                            >
                                <MenuItem value="">Immediately</MenuItem>
                                <MenuItem value="tomorrow">Tomorrow</MenuItem>
                                <MenuItem value="next-week">Next Week</MenuItem>
                                <MenuItem value="custom">Custom Date</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                );

            default:
                return 'Unknown step';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton onClick={() => navigate('/mapping')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="text.primary">
                            Create New Mapping
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Assign an assessment to a user
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Main Content */}
            <Paper sx={{ p: 3 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {getStepContent(activeStep)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Box>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                startIcon={<SaveIcon />}
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Mapping'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>

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

export default CreateMappingPage;