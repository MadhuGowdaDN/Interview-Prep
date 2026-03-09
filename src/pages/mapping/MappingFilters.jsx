import React from 'react';
import {
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button
} from '@common/mui';

const MappingFilters = ({ filters, onFilterChange }) => {
    const handleChange = (field, value) => {
        onFilterChange({
            ...filters,
            [field]: value
        });
    };

    const handleClear = () => {
        onFilterChange({
            status: '',
            assessmentName: ''
        });
    };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters.status}
                        label="Status"
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="started">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    fullWidth
                    size="small"
                    label="Assessment Name"
                    value={filters.assessmentName}
                    onChange={(e) => handleChange('assessmentName', e.target.value)}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={handleClear}
                    fullWidth
                >
                    Clear Filters
                </Button>
            </Grid>
        </Grid>
    );
};

export default MappingFilters;