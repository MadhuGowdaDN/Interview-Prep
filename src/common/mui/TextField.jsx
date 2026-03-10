import { TextField as MuiTextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const TextField = ({ name, ...props }) => {
    let field = {};
    let meta = {};

    const formik = useFormikContext?.();

    if (formik && name) {
        [field, meta] = useField(name);
    }

    const showError = Boolean(meta?.touched && meta?.error);

    return (
        <MuiTextField
            {...field}
            {...props}
            name={name}
            error={showError}
            helperText={showError ? meta.error : props.helperText}
            fullWidth
        />
    );
};

export default TextField;
