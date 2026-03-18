import { DynamicTable } from '@common';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@common/mui';
import { deleteAssessment, getAssessments } from '@features/assessments/assessmentSlice';
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from '@icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AssessmentList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const { list, totalCount, loading } = useSelector((state) => state.assessments);
    useEffect(() => {
        dispatch(getAssessments({ params: { page: paginationModel.page + 1, limit: paginationModel.pageSize } }));
    }, [dispatch, paginationModel]);

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedId) {
            await dispatch(deleteAssessment({ urlParams: { id: selectedId } }));
            dispatch(getAssessments({ params: { page: paginationModel.page + 1, limit: paginationModel.pageSize } }));
            setDeleteModalOpen(false);
            setSelectedId(null);
        }
    };


    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'Assessment Title', flex: 1, minWidth: 200 },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'createdAt', headerName: 'Created Date', width: 180, type: 'date', valueGetter: (params) => params.value ? new Date(params.value) : null },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 170,
            sortable: false,
            renderCell: (params) => {
                console.log("params.row ", params.row);
                return (
                    <Box>
                        <Tooltip title="View Questions">
                            <IconButton color="info" size="small" onClick={() => navigate(`/assessments/${params.row._id || params.row.id}/questions`)}>
                                <ViewIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Assessment">
                            <IconButton color="primary" size="small" onClick={() => navigate(`/assessments/${params.row._id || params.row.id}/edit`)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Assessment">
                            <IconButton color="error" size="small" onClick={() => handleDeleteClick(params.row._id || params.row.id)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
            }
        },
    ];

    // Mocking fallback data
    const rows = (list && list.length > 0) ? list : [];
    // : [
    //     { id: 1, title: 'Senior Frontend Developer Role', type: 'Technical', status: 'Active', createdAt: new Date().toISOString() },
    //     { id: 2, title: 'Backend Node.js Challenge', type: 'Coding', status: 'Draft', createdAt: new Date().toISOString() },
    // ];

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

            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle>Delete Assessment</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this assessment? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AssessmentList;
