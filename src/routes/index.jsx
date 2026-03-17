import AppLayout from '@common/layout/AppLayout';
import { Box, CircularProgress } from '@common/mui';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Load directly from pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const AssessmentList = lazy(() => import('../pages/assessments/AssessmentList'));
const CreateAssessment = lazy(() => import('../pages/assessments/CreateAssessment'));
const EditAssessment = lazy(() => import('../pages/assessments/EditAssessment'));
const AssessmentQuestionsList = lazy(() => import('../pages/assessments/AssessmentQuestionsList'));
const MappingPage = lazy(() => import('../pages/mapping/MappingPage'));

const PrepareAssessment = lazy(() => import('../pages/prepare/PrepareAssessment'));
const MappingResultsPage = lazy(() => import('../pages/mapping/MappingResultsPage'));
const MappingDetailPage = lazy(() => import('../pages/mapping/MappingDetailPage'));
const CreateMappingPage = lazy(() => import('../pages/mapping/CreateMappingPage'));

// Global Loader for suspense fallbacks
const GlobalLoader = () => (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} thickness={4} />
    </Box>
);

export const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Suspense fallback={<GlobalLoader />}>
                <LoginPage />
            </Suspense>
        ),
    },
    {
        path: '/register',
        element: (
            <Suspense fallback={<ProtectedRoute><GlobalLoader /></ProtectedRoute>}>
                <RegisterPage />
            </Suspense>
        ),
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<GlobalLoader />}>
                        <DashboardPage />
                    </Suspense>
                ),
            },
            {
                path: 'assessments',
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<GlobalLoader />}>
                                <AssessmentList />
                            </Suspense>
                        )
                    },
                    {
                        path: 'create',
                        element: (
                            <Suspense fallback={<GlobalLoader />}>
                                <CreateAssessment />
                            </Suspense>
                        )
                    },
                    {
                        path: ':id/edit',
                        element: (
                            <Suspense fallback={<GlobalLoader />}>
                                <EditAssessment />
                            </Suspense>
                        )
                    },
                    {
                        path: ':id/questions',
                        element: (
                            <Suspense fallback={<GlobalLoader />}>
                                <AssessmentQuestionsList />
                            </Suspense>
                        )
                    }
                ]
            },
            {
                path: 'prepare',
                element: (
                    <Suspense fallback={<GlobalLoader />}>
                        <PrepareAssessment />
                    </Suspense>
                ),
            },
            {
                path: 'mapping',
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<GlobalLoader />}>
                                <MappingPage />
                            </Suspense>
                        )
                    },
                    {
                        path: 'create',
                        element: (
                            <Suspense fallback={<GlobalLoader />}>
                                <CreateMappingPage />
                            </Suspense>
                        )
                    },
                    {
                        path: ':id',
                        element: (
                            <Suspense fallback={<GlobalLoader />}>
                                <MappingDetailPage />
                            </Suspense>
                        )
                    },
                    {
                        path: ':id/results',
                        element: (
                            <Suspense fallback={<GlobalLoader />}>
                                <MappingResultsPage />
                            </Suspense>
                        )
                    },
                ]
            },
            // {
            //     path: '*', // Catch-all for 404 inside layout
            //     element: <Navigate to="/" replace />,
            // },
        ],
    },
]);
