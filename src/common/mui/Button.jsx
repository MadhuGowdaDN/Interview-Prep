import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = ({ children, loading, disabled, startIcon, endIcon, variant = 'contained', color = 'primary', ...props }) => {
    return (
        <MuiButton
            variant={variant}
            color={color}
            disabled={loading || disabled}
            startIcon={!loading && startIcon}
            endIcon={!loading && endIcon}
            {...props}
        >
            {loading ? <CircularProgress size={24} color="inherit" /> : children}
        </MuiButton>
    );
};

export default Button;
