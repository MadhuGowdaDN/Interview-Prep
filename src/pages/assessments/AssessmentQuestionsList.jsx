import {
    Box, Button, Card, CardActions, CardContent, Chip, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton, Typography
} from '@common';
import { addQuestion, clearCurrentAssessment, deleteQuestion, getAssessmentById, updateQuestion } from '@features/assessments/assessmentSlice';
import { AddIcon, ArrowBackIcon, DeleteIcon, EditIcon } from '@icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionFormModal from './components/QuestionFormModal';

const AssessmentQuestionsList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { details, loading } = useSelector((state) => state.assessments);

    const assessmentDetails = details?.data || details;

    const [modalOpen, setModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(getAssessmentById({ urlParams: { id } }));
        }
        return () => { dispatch(clearCurrentAssessment()); }
    }, [id, dispatch]);

    const handleAddClick = () => {
        setEditingQuestion(null);
        setModalOpen(true);
    };

    const handleEditClick = (question) => {
        setEditingQuestion(question);
        setModalOpen(true);
    };

    const handleDeleteClick = (questionId) => {
        setDeleteId(questionId);
    };

    const handleFormSubmit = async (values) => {
        let action;
        if (editingQuestion) {
            action = await dispatch(updateQuestion({
                urlParams: { id, questionId: editingQuestion._id || editingQuestion.id },
                body: values
            }));
        } else {
            action = await dispatch(addQuestion({
                urlParams: { id },
                body: values
            }));
        }

        if (!action.error) {
            setModalOpen(false);
            dispatch(getAssessmentById({ urlParams: { id } })); // Refresh the list
        } else {
            alert(action.payload?.message || "Operation failed.");
        }
    };

    const confirmDelete = async () => {
        if (deleteId) {
            const action = await dispatch(deleteQuestion({ urlParams: { id, questionId: deleteId } }));
            if (!action.error) {
                dispatch(getAssessmentById({ urlParams: { id } })); // Refresh list
            } else {
                alert(action.payload?.message || "Operation failed.");
            }
            setDeleteId(null);
        }
    };

    if (loading && !assessmentDetails) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (!assessmentDetails) {
        return <Typography color="error">Assessment not found</Typography>;
    }

    const formatQuestionType = (type) => {
        const types = { 'mcq': 'Multiple Choice', 'text': 'Short Text', 'coding': 'Coding' };
        return types[type] || type;
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/assessments')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                        Questions List
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {assessmentDetails.title}
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
                    Add Question
                </Button>
            </Box>

            {(!assessmentDetails.questions || assessmentDetails.questions.length === 0) ? (
                <Box textAlign="center" py={5} bgcolor="background.paper" borderRadius={2} border="1px dashed text.disabled">
                    <Typography color="text.secondary">No questions found in this assessment.</Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {assessmentDetails.questions.map((q, idx) => (
                        <Grid item xs={12} key={q._id || idx}>
                            <Card variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Q{idx + 1}.
                                        </Typography>
                                        <Chip label={formatQuestionType(q.type)} size="small" color="primary" variant="outlined" />
                                        <Chip label={q.difficulty} size="small" color="secondary" variant="outlined" />
                                        {q.skill && <Chip label={q.skill} size="small" variant="outlined" />}
                                    </Box>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
                                        {q.question}
                                    </Typography>

                                    {q.type === 'mcq' && q.options?.length > 0 && (
                                        <Box sx={{ mt: 1, pl: 2, borderLeft: '3px solid', borderColor: 'divider' }}>
                                            {q.options.map((opt, i) => (
                                                <Typography key={i} variant="body2" color="text.secondary">
                                                    {i + 1}. {opt} {opt === q.correctAnswer && '(Correct)'}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
                                    {q.type !== 'mcq' && q.correctAnswer && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            <strong>Answer:</strong> {q.correctAnswer}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions sx={{ flexDirection: 'column', gap: 1, pt: 2, pr: 2 }}>
                                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(q)}>
                                        Edit
                                    </Button>
                                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(q._id || q.id)}>
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <QuestionFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={editingQuestion}
                onSubmit={handleFormSubmit}
                loading={loading}
            />

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Delete Question</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this question? This action cannot be undone.
                    If the assessment is currently "in progress", this may fail.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)} color="inherit">Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AssessmentQuestionsList;
