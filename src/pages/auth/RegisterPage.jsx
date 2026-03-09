import React, { useEffect } from 'react';
import { Box, Typography, Container, Paper, Alert } from '@common/mui';
import { FormWrapper } from '@common/mui';
import DynamicForm from '@common/components/DynamicForm';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError, clearSuccess } from '@features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const REGISTER_SCHEMA = [
    {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        gridProps: { sm: 12 },
    },
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
    {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        gridProps: { sm: 12 },
    },
];

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
});

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, errorMessage, successMessage } = useSelector((state) => state.auth);

    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearSuccess());
        }
    }, [dispatch]);

    const handleSubmit = async (values, { setSubmitting }) => {
        const { confirmPassword, ...registerData } = values;
        const action = await dispatch(register(registerData));
        if (Object.keys(action.payload || {}).length > 0 && !action.error) {
            // Timeout needed only to show success message before redirect
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3, borderTop: '4px solid #10B981' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Typography component="h1" variant="h4" fontWeight="bold" color="text.primary">
                        Create an Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Join the Enterprise Platform
                    </Typography>
                </Box>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                        {errorMessage}
                    </Alert>
                )}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
                        Registration successful! Redirecting...
                    </Alert>
                )}

                <FormWrapper
                    initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <DynamicForm
                            schema={REGISTER_SCHEMA}
                            isSubmitting={loading || isSubmitting}
                            submitLabel="Register"
                        />
                    )}
                </FormWrapper>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
