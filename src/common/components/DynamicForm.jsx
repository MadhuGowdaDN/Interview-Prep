import React from 'react';
import { Grid, Box, MenuItem } from '@common/mui';
import TextField from '../mui/TextField';
import Autocomplete from '../mui/Autocomplete';
import Button from '../mui/Button';

// Dynamic form generator that accepts a schema array
const DynamicForm = ({
    schema,
    isSubmitting,
    submitLabel = 'Submit',
    onCancel,
    cancelLabel = 'Cancel'
}) => {
    return (
        <Box>
            <Grid container spacing={2}>
                {schema.map((field) => (
                    <Grid item xs={12} sm={field.gridProps?.sm || 12} md={field.gridProps?.md || 12} key={field.name}>
                        {field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number' || field.type === 'select' ? (
                            <TextField
                                name={field.name}
                                label={field.label}
                                type={field.type === 'select' ? 'text' : field.type}
                                select={field.type === 'select'}
                                {...field.props}
                            >
                                {field.type === 'select' && field.options?.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        ) : field.type === 'autocomplete' ? (
                            <Autocomplete
                                name={field.name}
                                label={field.label}
                                fetchOptions={field.fetchOptions}
                                getOptionLabel={field.getOptionLabel}
                                {...field.props}
                            />
                        ) : null}
                        {/* Can easily add Checkbox, Radio, Select here later */}
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {onCancel && (
                    <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isSubmitting}>
                        {cancelLabel}
                    </Button>
                )}
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {submitLabel}
                </Button>
            </Box>
        </Box>
    );
};

export default DynamicForm;
