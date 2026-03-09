import React from 'react';
import { TextField as MuiTextField } from '@mui/material';
import { useField } from 'formik';

const TextField = ({ name, ...props }) => {
    const [field, meta] = useField(name);
    const showError = Boolean(meta.touched && meta.error);

    return (
        <MuiTextField
            {...field}
            {...props}
            error={showError}
            helperText={showError ? meta.error : props.helperText}
            fullWidth
        />
    );
};

export default TextField;
