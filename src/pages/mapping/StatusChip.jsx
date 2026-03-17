import { Chip } from '@common/mui';
import { CompletedIcon, PendingIcon, StartedIcon } from '@icons';

const StatusChip = ({ status }) => {
    const statusConfig = {
        'pending': {
            color: 'warning',
            icon: <PendingIcon />,
            label: 'Pending'
        },
        'started': {
            color: 'info',
            icon: <StartedIcon />,
            label: 'In Progress'
        },
        'in-progress': {
            color: 'info',
            icon: <StartedIcon />,
            label: 'In Progress'
        },
        'completed': {
            color: 'success',
            icon: <CompletedIcon />,
            label: 'Completed'
        },
        'expired': {
            color: 'error',
            icon: <CompletedIcon />,
            label: 'Expired'
        },
    };

    const config = statusConfig[status?.toLowerCase()] || {
        color: 'default',
        icon: null,
        label: status || 'Unknown'
    };

    return (
        <Chip
            size="small"
            color={config.color}
            icon={config.icon}
            label={config.label}
            sx={{ minWidth: 100 }}
        />
    );
};

export default StatusChip;