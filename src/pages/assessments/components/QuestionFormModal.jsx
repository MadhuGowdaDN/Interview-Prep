import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, TextField, Typography } from '@common/mui';
import { AddCircleOutlineIcon, DeleteIcon } from '@icons';
import { FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    skill: Yup.string().required('Skill is required'),
    question: Yup.string().required('Question text is required'),
    type: Yup.string().required('Type is required'),
    difficulty: Yup.string().required('Difficulty is required'),
    correctAnswer: Yup.string().required('Correct Answer is required'),
    options: Yup.array().of(Yup.string().required('Option cannot be empty'))
});

const defaultValues = {
    skill: '',
    question: '',
    type: 'mcq',
    difficulty: 'easy',
    correctAnswer: '',
    options: ['', '']
};

const QuestionFormModal = ({ open, onClose, initialData, onSubmit, loading }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Edit Question' : 'Add Question'}</DialogTitle>
            <Formik
                initialValues={initialData || defaultValues}
                validationSchema={validationSchema}
                onSubmit={(values) => onSubmit(values)}
                enableReinitialize
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <DialogContent dividers>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField name="question" label="Question Text" multiline rows={2} fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="type" label="Type" select fullWidth>
                                        <MenuItem value="mcq">Multiple Choice</MenuItem>
                                        <MenuItem value="text">Short Text</MenuItem>
                                        <MenuItem value="coding">Coding</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="skill" label="Target Skill" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="difficulty" label="Difficulty" select fullWidth>
                                        <MenuItem value="easy">Easy</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="hard">Hard</MenuItem>
                                    </TextField>
                                </Grid>
                                
                                {values.type === 'mcq' && (
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Options</Typography>
                                        <FieldArray name="options">
                                            {({ push, remove }) => (
                                                <Box>
                                                    {values.options.map((opt, idx) => (
                                                        <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                            <TextField name={`options.${idx}`} size="small" placeholder={`Option ${idx + 1}`} fullWidth />
                                                            <IconButton color="error" onClick={() => remove(idx)}>
                                                                <DeleteIcon fontSize="small"/>
                                                            </IconButton>
                                                        </Box>
                                                    ))}
                                                    <Button startIcon={<AddCircleOutlineIcon />} size="small" onClick={() => push('')}>
                                                        Add Option
                                                    </Button>
                                                </Box>
                                            )}
                                        </FieldArray>
                                    </Grid>
                                )}
                                
                                <Grid item xs={12}>
                                    <TextField name="correctAnswer" label="Correct Answer (Exact Match)" fullWidth />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose} color="inherit" disabled={loading || isSubmitting}>Cancel</Button>
                            <Button type="submit" variant="contained" loading={loading || isSubmitting}>
                                {initialData ? 'Update' : 'Add'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default QuestionFormModal;
