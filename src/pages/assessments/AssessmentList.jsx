import DynamicTable from '@common/components/DynamicTable';
import { Box, Button, IconButton, Typography } from '@common/mui';
import { getAssessments } from '@features/assessments/assessmentSlice';
import { AddIcon, DeleteIcon, EditIcon } from '@icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AssessmentList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    const { list, totalCount, loading } = useSelector((state) => state.assessments);

    useEffect(() => {
        dispatch(getAssessments({ params: { page: paginationModel.page + 1, limit: paginationModel.pageSize } }));
    }, [dispatch, paginationModel]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'Assessment Title', flex: 1, minWidth: 200 },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'createdAt', headerName: 'Created Date', width: 180, type: 'date', valueGetter: (params) => params.value ? new Date(params.value) : null },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
                    <IconButton color="error" size="small"><DeleteIcon fontSize="small" /></IconButton>
                </Box>
            ),
        },
    ];

    // Mocking fallback data
    const rows = list && list.length > 0 ? list : [
        { id: 1, title: 'Senior Frontend Developer Role', type: 'Technical', status: 'Active', createdAt: new Date().toISOString() },
        { id: 2, title: 'Backend Node.js Challenge', type: 'Coding', status: 'Draft', createdAt: new Date().toISOString() },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                    Assessments
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/assessments/create')}
                >
                    Create Assessment
                </Button>
            </Box>

            <DynamicTable
                rows={rows}
                columns={columns}
                loading={loading}
                page={paginationModel.page}
                pageSize={paginationModel.pageSize}
                totalCount={totalCount || rows.length}
                onPageChange={(page) => setPaginationModel(prev => ({ ...prev, page }))}
                onPageSizeChange={(pageSize) => setPaginationModel(prev => ({ ...prev, pageSize }))}
            />
        </Box>
    );
};

export default AssessmentList;
