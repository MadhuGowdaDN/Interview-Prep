import React, { useState, useEffect } from 'react';
import { Autocomplete as MuiAutocomplete, CircularProgress, TextField as MuiTextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const Autocomplete = ({ name, label, fetchOptions, getOptionLabel, ...props }) => {
    const [field, meta] = useField(name);
    const { setFieldValue } = useFormikContext();
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;

        if (!open) {
            return undefined;
        }

        (async () => {
            setLoading(true);
            try {
                const data = await fetchOptions();
                if (active) {
                    setOptions([...data]);
                }
            } catch (error) {
                console.error("Failed to load autocomplete options", error)
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [open, fetchOptions]);

    const showError = Boolean(meta.touched && meta.error);

    return (
        <MuiAutocomplete
            id={name}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={getOptionLabel}
            options={options}
            loading={loading}
            value={field.value || null}
            onChange={(_, newValue) => setFieldValue(name, newValue)}
            renderInput={(params) => (
                <MuiTextField
                    {...params}
                    label={label}
                    error={showError}
                    helperText={showError ? meta.error : props.helperText}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
            {...props}
        />
    );
};

export default Autocomplete;
