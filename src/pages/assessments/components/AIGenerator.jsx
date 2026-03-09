import React from 'react';
import { Box, Typography, Alert } from '@common/mui';
import { FormWrapper } from '@common/mui';
import DynamicForm from '@common/components/DynamicForm';
import * as Yup from 'yup';
import { AiIcon } from '@icons';

const AI_SCHEMA = [
    { name: 'topic', label: 'Topic (e.g., React JS)', type: 'text', gridProps: { sm: 12 } },
    { name: 'skill', label: 'Specific Skill (e.g., Hooks)', type: 'text', gridProps: { sm: 6 } },
    {
        name: 'questionType',
        label: 'Question Type',
        type: 'select',
        options: [{ label: 'MCQ', value: 'mcq' }, { label: 'Short Text', value: 'short' }, { label: 'Coding', value: 'coding' }],
        gridProps: { sm: 6 }
    },
    { name: 'numberOfQuestions', label: 'Number of Questions', type: 'number', gridProps: { sm: 4 } },
    { name: 'duration', label: 'Duration (minutes)', type: 'number', gridProps: { sm: 4 } },
    {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [{ label: 'Easy', value: 'easy' }, { label: 'Medium', value: 'medium' }, { label: 'Hard', value: 'hard' }],
        gridProps: { sm: 4 }
    },
];

const validationSchema = Yup.object({
    topic: Yup.string().required('Required'),
    skill: Yup.string().required('Required'),
    questionType: Yup.string().required('Required'),
    numberOfQuestions: Yup.number().min(1).max(50).required('Required'),
    duration: Yup.number().min(5).max(180).required('Required'),
    difficulty: Yup.string().required('Required'),
});

const AIGenerator = ({ onSubmit, loading, error }) => {
    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AiIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                    AI Assessment Generator
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <FormWrapper
                initialValues={{ topic: '', skill: '', questionType: 'mcq', numberOfQuestions: 10, duration: 30, difficulty: 'medium' }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <DynamicForm
                        schema={AI_SCHEMA}
                        isSubmitting={loading || isSubmitting}
                        submitLabel="Generate with AI ✨"
                    />
                )}
            </FormWrapper>
        </Box>
    );
};

export default AIGenerator;
