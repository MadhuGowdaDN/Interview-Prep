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
    Stack,
    Avatar,
    LinearProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Tooltip,
    CircularProgress,
    Rating,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@common/mui';
import { ArrowBackIcon, AssessmentIcon, PersonIcon, CheckCircleIcon, CancelIcon, DownloadIcon, PrintIcon, ShareIcon, ExpandMoreIcon, ScheduleIcon, ScoreIcon } from '@icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMappingResults } from '@features/mapping/mappingSlice';
import { formatDate } from '@common/utils/dateUtils';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#4caf50', '#f44336', '#ff9800', '#2196f3'];

const MappingResultsPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        fetchResults();
    }, [id]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            // Mock data - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock results data
            const mockResults = {
                id: id,
                assessmentName: 'Senior Frontend Developer Assessment',
                userName: 'John Doe',
                userEmail: 'john.doe@example.com',
                completedAt: new Date().toISOString(),
                startedAt: new Date(Date.now() - 7200000).toISOString(),
                duration: 120,
                timeSpent: 105,
                totalQuestions: 25,
                answeredQuestions: 25,
                correctAnswers: 18,
                incorrectAnswers: 7,
                score: 72,
                passingScore: 70,
                status: 'passed',
                skillBreakdown: [
                    { skill: 'React', correct: 8, total: 10, percentage: 80 },
                    { skill: 'JavaScript', correct: 5, total: 6, percentage: 83.3 },
                    { skill: 'CSS/HTML', correct: 3, total: 4, percentage: 75 },
                    { skill: 'State Management', correct: 2, total: 3, percentage: 66.7 },
                    { skill: 'Testing', correct: 0, total: 2, percentage: 0 }
                ],
                questionResults: [
                    {
                        id: 1,
                        question: 'What is the virtual DOM in React?',
                        type: 'mcq',
                        skill: 'React',
                        userAnswer: 'A lightweight copy of the actual DOM',
                        correctAnswer: 'A lightweight copy of the actual DOM',
                        isCorrect: true,
                        timeSpent: 45
                    },
                    {
                        id: 2,
                        question: 'Explain the useEffect hook lifecycle',
                        type: 'text',
                        skill: 'React',
                        userAnswer: 'Runs after render and can cleanup',
                        correctAnswer: 'Runs after every render by default',
                        isCorrect: true,
                        timeSpent: 120
                    },
                    {
                        id: 3,
                        question: 'Which method is used to create a React component?',
                        type: 'mcq',
                        skill: 'React',
                        userAnswer: 'createComponent()',
                        correctAnswer: 'React.createElement()',
                        isCorrect: false,
                        timeSpent: 30
                    },
                    {
                        id: 4,
                        question: 'What is closure in JavaScript?',
                        type: 'mcq',
                        skill: 'JavaScript',
                        userAnswer: 'Function with access to outer scope',
                        correctAnswer: 'Function with access to outer scope',
                        isCorrect: true,
                        timeSpent: 60
                    },
                    {
                        id: 5,
                        question: 'Write a function to debounce user input',
                        type: 'coding',
                        skill: 'JavaScript',
                        userAnswer: 'function debounce(fn, delay) { let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); } }',
                        correctAnswer: 'Similar implementation with timer',
                        isCorrect: true,
                        timeSpent: 180
                    }
                ],
                recommendations: [
                    'Review React lifecycle methods and hooks',
                    'Practice more advanced JavaScript concepts',
                    'Work on state management patterns',
                    'Improve testing skills with React Testing Library'
                ]
            };

            setResults(mockResults);
        } catch (err) {
            setError(err.message || 'Failed to fetch results');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (format) => {
        // Implement export functionality
        console.log(`Exporting as ${format}`);
    };

    const handlePrint = () => {
        window.print();
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !results) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || 'Results not found'}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/mapping')}
                >
                    Back to Mappings
                </Button>
            </Box>
        );
    }

    const radarData = results.skillBreakdown.map(item => ({
        skill: item.skill,
        value: item.percentage
    }));

    const pieData = [
        { name: 'Correct', value: results.correctAnswers },
        { name: 'Incorrect', value: results.incorrectAnswers },
        { name: 'Skipped', value: results.totalQuestions - results.answeredQuestions }
    ].filter(item => item.value > 0);

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <IconButton onClick={() => navigate(`/mapping/${id}`)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" fontWeight={700} color="text.primary">
                            Assessment Results
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {results.assessmentName}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleExport('pdf')}
                        >
                            Export PDF
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                        >
                            Print
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ShareIcon />}
                            onClick={() => handleExport('share')}
                        >
                            Share
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ bgcolor: getScoreColor(results.score) === 'success' ? 'success.main' : 'warning.main', width: 56, height: 56 }}>
                                    <ScoreIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h3" fontWeight={700} color={getScoreColor(results.score)}>
                                        {results.score}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Final Score
                                    </Typography>
                                    <Chip
                                        size="small"
                                        color={results.status === 'passed' ? 'success' : 'error'}
                                        label={results.status === 'passed' ? 'PASSED' : 'FAILED'}
                                        sx={{ mt: 1 }}
                                    />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Correct Answers</Typography>
                                    <Typography variant="body1" fontWeight={600} color="success.main">
                                        {results.correctAnswers}/{results.totalQuestions}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Incorrect Answers</Typography>
                                    <Typography variant="body1" fontWeight={600} color="error.main">
                                        {results.incorrectAnswers}/{results.totalQuestions}
                                    </Typography>
                                </Stack>
                                <Divider />
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Accuracy</Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <ScheduleIcon color="action" />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Time Taken</Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {results.timeSpent} mins / {results.duration} mins
                                        </Typography>
                                    </Box>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={(results.timeSpent / results.duration) * 100}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" color="text.secondary">Started</Typography>
                                    <Typography variant="caption" color="text.secondary">{formatDate(results.startedAt, 'MMM DD, HH:mm')}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" color="text.secondary">Completed</Typography>
                                    <Typography variant="caption" color="text.secondary">{formatDate(results.completedAt, 'MMM DD, HH:mm')}</Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts and Analysis */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Skill Breakdown
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="skill" />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                        <Radar
                                            name="Performance"
                                            dataKey="value"
                                            stroke="#8884d8"
                                            fill="#8884d8"
                                            fillOpacity={0.6}
                                        />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Answer Distribution
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Skill Performance Table */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Skill-wise Performance
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Skill</TableCell>
                                    <TableCell align="center">Correct</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center">Percentage</TableCell>
                                    <TableCell>Performance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.skillBreakdown.map((skill, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {skill.skill}
                                        </TableCell>
                                        <TableCell align="center">{skill.correct}</TableCell>
                                        <TableCell align="center">{skill.total}</TableCell>
                                        <TableCell align="center">{skill.percentage.toFixed(1)}%</TableCell>
                                        <TableCell sx={{ minWidth: 150 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={skill.percentage}
                                                        color={skill.percentage >= 70 ? 'success' : skill.percentage >= 50 ? 'warning' : 'error'}
                                                        sx={{ height: 8, borderRadius: 4 }}
                                                    />
                                                </Box>
                                                <Box sx={{ minWidth: 35 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {skill.percentage.toFixed(0)}%
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Detailed Question Results */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Question-wise Analysis
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Question</TableCell>
                                    <TableCell>Skill</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Result</TableCell>
                                    <TableCell align="center">Time Spent</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.questionResults.map((question, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Tooltip title={question.question}>
                                                <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                                    {question.question}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{question.skill}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={question.type}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {question.isCorrect ? (
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
                                        <TableCell align="center">{question.timeSpent}s</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Recommendations */}
            {results.recommendations.length > 0 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                            Recommendations for Improvement
                        </Typography>
                        <Stack spacing={2}>
                            {results.recommendations.map((rec, index) => (
                                <Alert key={index} severity="info" variant="outlined">
                                    {rec}
                                </Alert>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default MappingResultsPage;