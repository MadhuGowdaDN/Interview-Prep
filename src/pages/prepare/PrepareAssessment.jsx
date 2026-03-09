import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, RadioGroup, FormControlLabel, Radio, Divider } from '@common/mui';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@common/mui';
import { useDispatch, useSelector } from 'react-redux';
import { getPrepareTime, submitAnswer, submitAssessment, clearTimeData } from '@features/prepare/prepareSlice';

const PrepareAssessment = () => {
    const [searchParams] = useSearchParams();
    const mappingId = searchParams.get('mappingId');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { timeData, loading } = useSelector((state) => state.prepare);

    const [timeLeft, setTimeLeft] = useState(3600); // Default 1 hr fallback
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');

    // Initial Fetch
    useEffect(() => {
        if (mappingId) {
            dispatch(getPrepareTime({ params: { mappingId } }));
        }
        return () => dispatch(clearTimeData());
    }, [dispatch, mappingId]);

    // Update Time
    useEffect(() => {
        if (timeData?.remainingSeconds) {
            setTimeLeft(timeData.remainingSeconds);
        }
    }, [timeData]);

    // Ticker
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Mock Questions Data
    const questions = [
        { id: 1, text: "React component lifecycle replacement in Functional components?", options: ["useEffect", "useState", "useContext", "useReducer"] },
        { id: 2, text: "What is the purpose of Redux Toolkit?", options: ["State Management", "Routing", "Styling", "Testing"] },
    ];

    const currentQ = questions[currentQuestionIdx];

    const handleNext = async () => {
        try {
            if (selectedAnswer) {
                await dispatch(submitAnswer({ body: { mappingId, questionId: currentQ.id, answer: selectedAnswer } }));
            }
            if (currentQuestionIdx < questions.length - 1) {
                setCurrentQuestionIdx(prev => prev + 1);
                setSelectedAnswer('');
            } else {
                await handleFinish();
            }
        } catch (e) {
            console.error("Answer submission failed", e);
        }
    };

    const handleFinish = async () => {
        try {
            await dispatch(submitAssessment({ body: { mappingId } }));
            navigate('/mapping'); // Return to mapping list
        } catch (e) {
            console.error("Assessment submission failed", e);
            // Fallback nav during mock dev
            navigate('/mapping');
        }
    };

    if (loading && !timeData) return <Box p={4}><Typography>Loading assessment data...</Typography></Box>;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                    Technical Assessment
                </Typography>
                <Paper
                    elevation={1}
                    sx={{
                        px: 2, py: 1,
                        backgroundColor: timeLeft < 300 ? 'error.light' : 'primary.main',
                        color: 'primary.contrastText',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                        {formatTime(timeLeft)}
                    </Typography>
                </Paper>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Question {currentQuestionIdx + 1} of {questions.length}
                </Typography>

                <Typography variant="h5" fontWeight={600} sx={{ mt: 2, mb: 4 }}>
                    {currentQ.text}
                </Typography>

                <RadioGroup
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    sx={{ flexGrow: 1 }}
                >
                    {currentQ.options.map((option, idx) => (
                        <Paper
                            key={idx}
                            variant="outlined"
                            sx={{
                                mb: 2,
                                p: 1,
                                px: 2,
                                borderColor: selectedAnswer === option ? 'primary.main' : 'divider',
                                backgroundColor: selectedAnswer === option ? 'primary.50' : 'transparent',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'primary.50'
                                }
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleFinish}
                        disabled={loading}
                    >
                        End Assessment
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!selectedAnswer || loading}
                    >
                        {currentQuestionIdx === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PrepareAssessment;
