import {
    CircularProgress,
    Autocomplete as MuiAutocomplete,
    TextField as MuiTextField,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import { useEffect, useState } from "react";

const Autocomplete = ({
    name,
    label,
    fetchOptions,
    getOptionLabel,
    value: valueProp,
    onChange: onChangeProp,
    ...props
}) => {
    const formik = useFormikContext?.();

    const [field, meta] = formik && name ? useField(name) : [{}, {}];

    const setFieldValue = formik?.setFieldValue;

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;

        if (!open) return;

        (async () => {
            setLoading(true);
            try {
                const data = await fetchOptions();
                if (active) setOptions([...data]);
            } catch (error) {
                console.error("Failed to load autocomplete options", error);
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [open, fetchOptions]);

    const showError = Boolean(meta?.touched && meta?.error);

    const value = formik ? field.value || null : valueProp || null;

    const handleChange = (_, newValue) => {
        if (formik && name) {
            setFieldValue(name, newValue);
        } else {
            onChangeProp?.(newValue);
        }
    };

    return (
        <MuiAutocomplete
            id={name}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            loading={loading}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            value={value}
            onChange={handleChange}
            renderInput={(params) => (
                <MuiTextField
                    {...params}
                    label={label}
                    error={showError}
                    helperText={showError ? meta?.error : props.helperText}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? (
                                    <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            {...props}
        />
    );
};

export default Autocomplete;
