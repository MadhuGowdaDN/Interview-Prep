import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#2563EB', // A sharp, modern blue
            light: '#60A5FA',
            dark: '#1D4ED8',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#4F46E5', // Indigo
            light: '#818CF8',
            dark: '#3730A3',
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
        },
        error: {
            main: '#EF4444',
            light: '#F87171',
            dark: '#B91C1C',
        },
        warning: {
            main: '#F59E0B',
            light: '#FBBF24',
            dark: '#D97706',
        },
        info: {
            main: '#3B82F6',
            light: '#60A5FA',
            dark: '#2563EB',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
        background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#0F172A',
            secondary: '#475569',
            disabled: '#94A3B8',
        },
        divider: '#E2E8F0',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2 },
        h2: { fontWeight: 700, fontSize: '2rem', lineHeight: 1.2 },
        h3: { fontWeight: 600, fontSize: '1.75rem', lineHeight: 1.2 },
        h4: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.2 },
        h5: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.2 },
        h6: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.2 },
        subtitle1: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.5 },
        subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.5 },
        body1: { fontSize: '1rem', lineHeight: 1.5 },
        body2: { fontSize: '0.875rem', lineHeight: 1.5 },
        button: { fontWeight: 600, textTransform: 'none' }, // Disable uppercase buttons for modern look
    },
    shape: {
        borderRadius: 8, // Modern rounded corners
    },
    shadows: [
        'none',
        '0px 1px 2px 0px rgba(0,0,0,0.05)',
        '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
        '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)',
        '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
        '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
        '0px 25px 50px -12px rgba(0,0,0,0.25)',
        ...Array(18).fill('none'), // Fill the rest of MUI's 25 shadows with none
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)',
                    },
                },
                contained: {
                    '&:active': { boxShadow: 'none' },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
                    border: '1px solid #E2E8F0',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                    },
                },
            },
        },
    },
});
