import React, { useEffect } from 'react';
import { Box, Typography, Container, Paper, Alert } from '@common/mui';
import { FormWrapper } from '@common/mui';
import DynamicForm from '@common/components/DynamicForm';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '@features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const LOGIN_SCHEMA = [
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        gridProps: { sm: 12 },
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        gridProps: { sm: 12 },
    },
];

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
});

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, errorMessage, isAuthenticated } = useSelector((state) => state.auth);
    console.log("isAuthenticated ", isAuthenticated)
    useEffect(() => {
        // If the user happens to land here but is authenticated, send to dash
        if (isAuthenticated) {
            navigate('/');
        }
        // Cleanup error on unmount
        return () => {
            dispatch(clearError());
        }
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = async (values) => {
        dispatch(clearError());
        const action = await dispatch(login(values));
        // If async thunk fulfilled, the slice will set isAuthenticated, triggering the useEffect
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3, borderTop: '4px solid #2563EB' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Typography component="h1" variant="h4" fontWeight="bold" color="text.primary">
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                        Please enter your details to access your account.
                    </Typography>
                </Box>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                        {errorMessage}
                    </Alert>
                )}

                <FormWrapper
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <DynamicForm
                            schema={LOGIN_SCHEMA}
                            isSubmitting={loading}
                            submitLabel="Log In"
                        />
                    )}
                </FormWrapper>
            </Paper>
        </Container>
    );
};

export default LoginPage;
