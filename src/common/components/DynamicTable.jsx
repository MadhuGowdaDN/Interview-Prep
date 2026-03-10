import { Paper } from '@common/mui';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const DynamicTable = ({
    rows = [],
    columns = [],
    loading = false,
    page = 0,
    pageSize = 10,
    totalCount = 0,
    onPageChange,
    onPageSizeChange,
    onSortModelChange,
    disableSelectionOnClick = true,
    checkboxSelection = false,
    ...props
}) => {
    return (
        <Paper sx={{ width: '100%', height: 'calc(100vh - 350px)', minHeight: 400 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                paginationMode="server" // Assuming server-side pagination for enterprise apps
                sortingMode="server"    // Assuming server-side sorting
                rowCount={totalCount}
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(model) => {
                    if (onPageChange && model.page !== page) onPageChange(model.page);
                    if (onPageSizeChange && model.pageSize !== pageSize) onPageSizeChange(model.pageSize);
                }}
                onSortModelChange={onSortModelChange}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                disableRowSelectionOnClick={disableSelectionOnClick}
                checkboxSelection={checkboxSelection}
                slots={{
                    toolbar: GridToolbar,
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#F8FAFC',
                        borderBottom: '2px solid #E2E8F0',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 600,
                        color: '#475569',
                    },
                }}
                getRowHeight={() => 'auto'}
                {...props}
            />
        </Paper>
    );
};

export default DynamicTable;
