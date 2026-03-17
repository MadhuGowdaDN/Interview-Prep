import { Box, CircularProgress, Typography } from '@common/mui';
import { clearError, getAssessmentById, updateAssessment } from '@features/assessments/assessmentSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ManualBuilder from './components/ManualBuilder';

const EditAssessment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { details, loading } = useSelector((state) => state.assessments);

    useEffect(() => {
        if (id) {
            dispatch(getAssessmentById({ urlParams: { id } }));
        }
    }, [id, dispatch]);

    const handleSaveAssessment = async (values) => {
        // Here we just submit the entire assessment including modified questions
        const action = await dispatch(updateAssessment({ urlParams: { id }, body: values }));
        if (!action.error) {
            navigate('/assessments');
        }
    };

    if (loading && !details) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!details) {
        return <Typography color="error">Assessment not found</Typography>;
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', py: 2 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                    Edit Assessment
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Update assessment details and its questions below.
                </Typography>
            </Box>

            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <ManualBuilder
                    initialData={details.data || details}
                    onSubmit={handleSaveAssessment}
                    loading={loading}
                    onCancel={() => navigate('/assessments')}
                />
            </Box>
        </Box>
    );
};

export default EditAssessment;
