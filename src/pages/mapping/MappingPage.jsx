import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Tooltip,
    IconButton,
    Paper,
    TextField,
    InputAdornment,
    Stack,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid
} from '@common/mui';
import { PlayIcon, ViewIcon, AddIcon, SearchIcon, FilterIcon, RefreshIcon } from '@icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DynamicTable from '@common/components/DynamicTable';
import { getMappings } from '@features';
import MappingFilters from './MappingFilters';
import StatusChip from './StatusChip';

const MappingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        assessmentName: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    const { data: list, totalCount, loading } = useSelector((state) => state.mapping);
    useEffect(() => {
        fetchMappings();
    }, [dispatch, paginationModel, filters]);

    const fetchMappings = useCallback(() => {
        const params = {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
            ...filters
        };

        if (searchTerm) {
            params.search = searchTerm;
        }

        dispatch(getMappings({ params }));
    }, [dispatch, paginationModel, filters, searchTerm]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    };

    const handleRefresh = () => {
        fetchMappings();
    };

    const handleCreateNew = () => {
        navigate('/mapping/create');
    };

    const handleViewDetails = (id) => {
        navigate(`/mapping/${id}`);
    };

    const handleStartAssessment = (row) => {
        if (row.status === 'completed') {
            navigate(`/mapping/${row.id}/results`);
        } else if (row.status === 'pending') {
            navigate(`/prepare?mappingId=${row.id}`);
        }
    };

    const columns = [
        {
            field: 'user',
            headerName: 'User',
            flex: 1.5,
            minWidth: 200,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" fontWeight={500}>
                        {params.row.user?.name || params.row.userName || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {params.row.user?.email || params.row.userEmail || ''}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'assessment',
            headerName: 'Assessment',
            flex: 2,
            minWidth: 250,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" fontWeight={500}>
                        {params.row.assessment?.title || params.row.assessmentName}
                    </Typography>
                    {params.row.assessment?.duration && (
                        <Typography variant="caption" color="text.secondary">
                            Duration: {params.row.assessment.duration} mins |
                            Questions: {params.row.assessment.questions?.length || 0}
                        </Typography>
                    )}
                </Box>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => <StatusChip status={params.value} />
        },
        {
            field: 'assignedDate',
            headerName: 'Assigned',
            width: 120,
            valueGetter: (params) => {
                const date = params.row?.createdAt || params.row?.assignedDate || '';
                return date ? new Date(date).toLocaleDateString() : 'N/A';
            }
        },
        {
            field: 'progress',
            headerName: 'Progress',
            width: 100,
            renderCell: (params) => {
                if (params.row.status === 'completed') return '100%';
                if (params.row.status === 'started') return 'In Progress';
                return 'Not Started';
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        size="small"
                        color={params.row.status === 'completed' ? 'success' : 'primary'}
                        startIcon={params.row.status === 'completed' ? <ViewIcon /> : <PlayIcon />}
                        onClick={() => handleStartAssessment(params.row)}
                        disabled={params.row.status === 'started'}
                        sx={{ minWidth: 90 }}
                    >
                        {params.row.status === 'completed' ? 'Results' :
                            params.row.status === 'started' ? 'In Progress' : 'Start'}
                    </Button>
                    <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleViewDetails(params.row.id)}
                        title="View Details"
                    >
                        <ViewIcon />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    // Transform the data to match table structure
    const transformRowData = (mapping) => ({
        id: mapping._id || mapping.id,
        user: mapping.userId || { name: mapping.userName, email: mapping.userEmail },
        userName: mapping.userId?.name || mapping.userName,
        userEmail: mapping.userId?.email || mapping.userEmail,
        assessment: mapping.assessmentId || {
            title: mapping.assessmentName,
            duration: mapping.duration,
            questions: mapping.questions
        },
        assessmentName: mapping.assessmentId?.title || mapping.assessmentName,
        status: mapping.status,
        createdAt: mapping?.createdAt,
        assignedDate: mapping?.createdAt,
        duration: mapping.assessmentId?.duration,
        questions: mapping.assessmentId?.questions
    });

    const rows = list?.length > 0 ? list.map(transformRowData) : [];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
                    Assessment Mappings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage and track user assessment assignments
                </Typography>
            </Box>

            {/* Actions Bar */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by user or assessment..."
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filters
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={handleRefresh}
                            >
                                Refresh
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleCreateNew}
                            >
                                New Mapping
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Filters */}
                {showFilters && (
                    <Box sx={{ mt: 2 }}>
                        <MappingFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </Box>
                )}
            </Paper>

            {/* Table */}
            <DynamicTable
                rows={rows}
                columns={columns}
                loading={loading}
                rowCount={totalCount}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25, 50]}
                getRowId={(row) => row.id}
                sx={{
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none'
                    }
                }}
                noRowsMessage="No assessment mapping found"
            />
        </Box>
    );
};

export default MappingPage;