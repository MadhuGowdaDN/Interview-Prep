import React from 'react';
import { Box, Typography, Paper, Grid, IconButton, Divider, MenuItem, Button as MuiButton } from '@common/mui';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@common/mui';
import { DeleteOutlineIcon, AddCircleOutlineIcon } from '@icons';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    duration: Yup.number().min(1).required('Duration required'),
    questions: Yup.array().of(
        Yup.object().shape({
            skill: Yup.string().required('Skill is required'),
            question: Yup.string().required('Question text is required'),
            type: Yup.string().required('Type is required'),
            difficulty: Yup.string().required('Difficulty is required'),
            correctAnswer: Yup.string().required('Correct Answer is required'),
            options: Yup.array().of(Yup.string().required('Option cannot be empty'))
        })
    )
});

const ManualBuilder = ({ initialData, onSubmit, loading, onCancel }) => {

    const defaultInitialValues = {
        title: '',
        description: '',
        duration: 30,
        questions: []
    };

    return (
        <Formik
            initialValues={initialData || defaultInitialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ values, errors, touched, isSubmitting }) => (
                <Form>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12}>
                            <TextField name="title" label="Assessment Title" />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField name="description" label="Description" multiline rows={2} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField name="duration" label="Duration (minutes)" type="number" />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Questions</Typography>

                    <FieldArray name="questions">
                        {({ push, remove }) => (
                            <Box>
                                {values.questions.length === 0 && (
                                    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', borderStyle: 'dashed' }}>
                                        <Typography color="text.secondary">No questions added yet.</Typography>
                                    </Paper>
                                )}

                                {values.questions.map((q, index) => (
                                    <Paper key={index} elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Question {index + 1}
                                            </Typography>
                                            <IconButton color="error" onClick={() => remove(index)}>
                                                <DeleteOutline />
                                            </IconButton>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField name={`questions.${index}.question`} label="Question Text" multiline rows={2} />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField name={`questions.${index}.type`} label="Type" select>
                                                    <MenuItem value="mcq">Multiple Choice</MenuItem>
                                                    <MenuItem value="text">Short Text</MenuItem>
                                                    <MenuItem value="coding">Coding</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField name={`questions.${index}.skill`} label="Target Skill" />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField name={`questions.${index}.difficulty`} label="Difficulty" select>
                                                    <MenuItem value="easy">Easy</MenuItem>
                                                    <MenuItem value="medium">Medium</MenuItem>
                                                    <MenuItem value="hard">Hard</MenuItem>
                                                </TextField>
                                            </Grid>

                                            {/* Options renderer (only show if MCQ) */}
                                            {q.type === 'mcq' && (
                                                <Grid item xs={12}>
                                                    <Divider sx={{ my: 1 }} />
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                                        Options & Answer
                                                    </Typography>
                                                    <FieldArray name={`questions.${index}.options`}>
                                                        {(optionHelpers) => (
                                                            <Box>
                                                                {q.options && q.options.length > 0 && q.options.map((opt, optIndex) => (
                                                                    <Box key={optIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                                        <TextField name={`questions.${index}.options.${optIndex}`} size="small" placeholder={`Option ${optIndex + 1}`} sx={{ flexGrow: 1 }} />
                                                                        <IconButton size="small" color="error" onClick={() => optionHelpers.remove(optIndex)}>
                                                                            <DeleteOutline fontSize="small" />
                                                                        </IconButton>
                                                                    </Box>
                                                                ))}
                                                                <MuiButton size="small" startIcon={<AddCircleOutline />} onClick={() => optionHelpers.push('')} sx={{ mt: 1 }}>
                                                                    Add Option
                                                                </MuiButton>
                                                            </Box>
                                                        )}
                                                    </FieldArray>
                                                </Grid>
                                            )}

                                            <Grid item xs={12}>
                                                <TextField name={`questions.${index}.correctAnswer`} label="Correct Answer (Exact Match)" size="small" sx={{ mt: 1 }} />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}

                                <Button
                                    variant="outlined"
                                    startIcon={<AddCircleOutline />}
                                    sx={{ mt: 2, mb: 4, width: '100%', py: 1.5, borderStyle: 'dashed' }}
                                    onClick={() => push({ skill: '', question: '', options: [], correctAnswer: '', difficulty: 'easy', type: 'mcq' })}
                                >
                                    Add New Question
                                </Button>
                            </Box>
                        )}
                    </FieldArray>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                        <Button variant="outlined" color="inherit" onClick={onCancel} disabled={loading || isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" loading={loading || isSubmitting}>
                            Save Assessment
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default ManualBuilder;
