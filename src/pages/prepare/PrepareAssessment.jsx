import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fade,
    FormControlLabel,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Radio,
    RadioGroup,
    Skeleton,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from '@common/mui';
import { clearTimeData, getPrepareTime, submitAnswer, submitAssessment } from '@features/prepare/prepareSlice';
import { ExitToAppIcon, FullscreenExitIcon, FullscreenIcon, NavigateBeforeIcon, NavigateNextIcon } from '@icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ----------------------------------------------------------------------
// Custom hook for full-screen management
function useFullScreen() {
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const handleChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    const toggleFullScreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    return { isFullScreen, toggleFullScreen };
}

// ----------------------------------------------------------------------
// Mock data – replace with actual API responses
const MOCK_QUESTIONS = [
    {
        id: 'q1',
        text: 'What is the virtual DOM in React?',
        options: [
            'A direct copy of the browser DOM',
            'A lightweight JavaScript object representing the real DOM',
            'A separate rendering engine',
            'A debugging tool',
        ],
    },
    {
        id: 'q2',
        text: 'Which hook is used for side effects in functional components?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    },
    {
        id: 'q3',
        text: 'What is Redux Toolkit primarily used for?',
        options: ['Routing', 'State management', 'Styling', 'API calls'],
    },
];

// ----------------------------------------------------------------------
const PrepareAssessment = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchParams] = useSearchParams();
    const mappingId = searchParams.get('mappingId');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isFullScreen, toggleFullScreen } = useFullScreen();

    // Redux state
    const { timeData, loading, error } = useSelector((state) => state.prepare);
    console.log("error ", error)
    console.log("timeData ", timeData)
    // Local state
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [answers, setAnswers] = useState({}); // { questionId: answer }
    const [endDialogOpen, setEndDialogOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [autoSubmitTimer, setAutoSubmitTimer] = useState(null);
    // --------------------------------------------------------------------
    // Questions – replace with real data from API (timeData.questions)
    const questions = MOCK_QUESTIONS; // TODO: use timeData.questions when available
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    // Timer reference for cleanup
    const timerRef = useRef(null);

    // --------------------------------------------------------------------
    // Initial data fetch
    useEffect(() => {
        if (!mappingId) return;

        dispatch(getPrepareTime({ id: mappingId }));
        dispatch(getPrepareTime({ id: mappingId }))
            .unwrap()
            .catch((err) => console.error('Failed to load exam:', err));

        return () => {
            dispatch(clearTimeData());
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [dispatch, mappingId]);

    // Update timeLeft from API response
    useEffect(() => {
        if (timeData?.remainingSeconds) {
            setTimeLeft(timeData.remainingSeconds);
        }
    }, [timeData]);

    // Start countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto‑submit when time runs out
    const handleAutoSubmit = useCallback(async () => {
        if (submitLoading) return;
        setSubmitLoading(true);
        try {
            // Submit any remaining answer
            if (selectedAnswer && currentQuestion) {
                await dispatch(
                    submitAnswer({
                        body: {
                            mappingId,
                            questionId: currentQuestion.id,
                            answer: selectedAnswer,
                        },
                    })
                ).unwrap();
            }
            await dispatch(submitAssessment({ body: { mappingId } })).unwrap();
            navigate('/mapping', { replace: true });
        } catch (err) {
            console.error('Auto-submit failed:', err);
        } finally {
            setSubmitLoading(false);
        }
    }, [currentQuestion, dispatch, mappingId, navigate, selectedAnswer, submitLoading]);

    // --------------------------------------------------------------------
    // Data validation
    if (!mappingId) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    No exam specified. Please go back to the mapping list.
                </Alert>
                <Button variant="contained" onClick={() => navigate('/mapping')}>
                    Go to Mappings
                </Button>
            </Box>
        );
    }

    if (loading && !timeData) {
        return (
            <Box sx={{ maxWidth: 800, mx: 'auto', py: 4, px: 2 }}>
                <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Box>
        );
    }

    if (error?.message || !timeData) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {typeof error === 'string' ? error : error?.message || 'No active exam found for this mapping.'}
                </Alert>
                <Button variant="contained" onClick={() => navigate('/mapping')}>
                    Back to Mappings
                </Button>
            </Box>
        );
    }

    // Handle answer selection
    const handleAnswerChange = (event) => {
        setSelectedAnswer(event.target.value);
    };

    // Save answer and move to next question
    const handleNext = async () => {
        if (!selectedAnswer) return;

        try {
            await dispatch(
                submitAnswer({
                    body: {
                        mappingId,
                        questionId: currentQuestion.id,
                        answer: selectedAnswer,
                    },
                })
            ).unwrap();

            // Store locally for palette
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedAnswer }));

            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
                setSelectedAnswer(answers[questions[currentQuestionIndex + 1].id] || '');
            } else {
                // Last question -> submit entire assessment
                await handleSubmitAssessment();
            }
        } catch (err) {
            console.error('Failed to submit answer:', err);
        }
    };

    // Submit entire assessment
    const handleSubmitAssessment = async () => {
        setSubmitLoading(true);
        try {
            await dispatch(submitAssessment({ body: { mappingId } })).unwrap();
            navigate('/mapping', { replace: true });
        } catch (err) {
            console.error('Assessment submission failed:', err);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Early exit confirmation
    const handleEndEarly = () => {
        setEndDialogOpen(true);
    };

    const confirmEndEarly = async () => {
        setEndDialogOpen(false);
        setSubmitLoading(true);
        try {
            await dispatch(submitAssessment({ body: { mappingId } })).unwrap();
            navigate('/mapping', { replace: true });
        } catch (err) {
            console.error('Early exit failed:', err);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Navigate to a specific question (from palette)
    const goToQuestion = (index) => {
        // Save current answer before switching
        if (selectedAnswer && currentQuestion) {
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedAnswer }));
        }
        setCurrentQuestionIndex(index);
        setSelectedAnswer(answers[questions[index].id] || '');
    };

    // Format time as HH:MM:SS
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const timerColor = timeLeft < 300 ? 'error' : timeLeft < 600 ? 'warning' : 'primary';

    // --------------------------------------------------------------------
    return (
        <Fade in={true}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
                {/* Header with timer and full-screen toggle */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Typography variant="h5" fontWeight={700}>
                        Technical Assessment
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
                        <Tooltip title={isFullScreen ? 'Exit full screen' : 'Full screen'}>
                            <IconButton onClick={toggleFullScreen} color="inherit" aria-label="full screen toggle">
                                {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            </IconButton>
                        </Tooltip>
                        <Paper
                            elevation={3}
                            sx={{
                                px: 3,
                                py: 1,
                                bgcolor: `${timerColor}.main`,
                                color: `${timerColor}.contrastText`,
                                borderRadius: 4,
                            }}
                        >
                            <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                                {formatTime(timeLeft)}
                            </Typography>
                        </Paper>
                    </Box>
                </Box>

                {/* Progress bar */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {Math.round(progress)}% complete
                        </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>

                {/* Main content area with question and palette */}
                <Grid container spacing={3}>
                    {/* Question panel */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, minHeight: 400 }}>
                            <Typography variant="subtitle1" color="primary" gutterBottom>
                                Question {currentQuestionIndex + 1}
                            </Typography>
                            <Typography variant="h5" fontWeight={600} sx={{ mt: 1, mb: 4 }}>
                                {currentQuestion.text}
                            </Typography>

                            <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
                                {currentQuestion.options.map((option, idx) => (
                                    <Paper
                                        key={idx}
                                        variant="outlined"
                                        sx={{
                                            mb: 2,
                                            p: 1,
                                            px: 2,
                                            borderColor: selectedAnswer === option ? 'primary.main' : 'divider',
                                            backgroundColor: selectedAnswer === option ? 'action.selected' : 'transparent',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                backgroundColor: 'action.hover',
                                            },
                                        }}
                                    >
                                        <FormControlLabel
                                            value={option}
                                            control={<Radio />}
                                            label={option}
                                            sx={{ width: '100%', m: 0 }}
                                        />
                                    </Paper>
                                ))}
                            </RadioGroup>

                            <Divider sx={{ my: 3 }} />

                            {/* Navigation buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<ExitToAppIcon />}
                                    onClick={handleEndEarly}
                                    disabled={submitLoading}
                                >
                                    End Assessment
                                </Button>
                                <Box>
                                    <IconButton
                                        disabled={currentQuestionIndex === 0}
                                        onClick={() => goToQuestion(currentQuestionIndex - 1)}
                                        sx={{ mr: 1 }}
                                    >
                                        <NavigateBeforeIcon />
                                    </IconButton>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        disabled={!selectedAnswer || submitLoading}
                                        endIcon={currentQuestionIndex === totalQuestions - 1 ? null : <NavigateNextIcon />}
                                    >
                                        {currentQuestionIndex === totalQuestions - 1 ? 'Submit Assessment' : 'Next'}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Question palette – hidden on mobile, can be toggled via drawer if needed */}
                    {!isMobile && (
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, position: 'sticky', top: 20 }}>
                                <Typography variant="h6" gutterBottom>
                                    Questions
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {questions.map((q, idx) => {
                                        const isAnswered = !!answers[q.id];
                                        const isCurrent = idx === currentQuestionIndex;
                                        return (
                                            <Tooltip key={q.id} title={`Question ${idx + 1}`}>
                                                <Chip
                                                    label={idx + 1}
                                                    onClick={() => goToQuestion(idx)}
                                                    color={isCurrent ? 'primary' : isAnswered ? 'success' : 'default'}
                                                    variant={isCurrent ? 'filled' : 'outlined'}
                                                    sx={{ cursor: 'pointer', minWidth: 40 }}
                                                />
                                            </Tooltip>
                                        );
                                    })}
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                                    Green = answered • Blue = current
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>

                {/* Exit confirmation dialog */}
                <Dialog open={endDialogOpen} onClose={() => setEndDialogOpen(false)}>
                    <DialogTitle>End Assessment Early?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Your answers will be submitted and you won't be able to continue. Are you sure?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEndDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmEndEarly} color="error" autoFocus>
                            End and Submit
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Loading overlay for submission */}
                {submitLoading && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            bgcolor: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                        }}
                    >
                        <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Submitting assessment...</Typography>
                            <LinearProgress sx={{ mt: 2, width: 200 }} />
                        </Paper>
                    </Box>
                )}
            </Box>
        </Fade>
    );
};

export default PrepareAssessment;