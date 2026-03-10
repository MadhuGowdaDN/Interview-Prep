import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@common/mui';
import { AiIcon, BuildIcon } from '@icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAssessment, generateAssessmentAi, clearError } from '@features/assessments/assessmentSlice';
import AIGenerator from './components/AIGenerator';
import ManualBuilder from './components/ManualBuilder';

const CreateAssessment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, errorMessage } = useSelector((state) => state.assessments);

    // 0 = Manual, 1 = AI
    const [tabValue, setTabValue] = useState(0);
    const [generatedData, setGeneratedData] = useState(null);

    const handleTabChange = (event, newValue) => {
        dispatch(clearError());
        setTabValue(newValue);
    };

    const handleAIGenerate = async (values) => {
        const action = await dispatch(generateAssessmentAi({ body: values }));
        if (!action.error && action.payload) {
            // The AI should return the generated assessment object matching the CreateAssessmentDto schema.
            // E.g. { title: '...', description: '...', duration: 30, questions: [...] }
            // We'll capture it, and switch to Manual mode for review.
            let data = action.payload.data || action.payload; // accommodate possible wrappers

            setGeneratedData({
                title: data.title || `${values.topic} Assessment`,
                description: data.description || `AI generated assessment for ${values.skill}`,
                duration: values.duration,
                questions: data.questions || []
            });
            setTabValue(0); // Switch to Manual builder to review
        }
    };

    const handleSaveAssessment = async (values) => {
        const action = await dispatch(createAssessment({ body: values }));
        if (!action.error) {
            navigate('/assessments');
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', py: 2 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                    {generatedData ? 'Review Generated Assessment' : 'Create Assessment'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {generatedData ? 'Review the AI generated content below. Edit and save.' : 'Build manually or use AI to instantly generate content.'}
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3, borderRadius: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab icon={<BuildIcon fontSize="small" />} iconPosition="start" label="Manual Builder" disabled={!!generatedData} />
                    <Tab icon={<AiIcon fontSize="small" />} iconPosition="start" label="Start with AI" disabled={!!generatedData} />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {tabValue === 0 && (
                        <ManualBuilder
                            initialData={generatedData}
                            onSubmit={handleSaveAssessment}
                            loading={loading}
                            onCancel={() => navigate('/assessments')}
                        />
                    )}

                    {tabValue === 1 && (
                        <AIGenerator
                            onSubmit={handleAIGenerate}
                            loading={loading}
                            error={errorMessage}
                        />
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateAssessment;
