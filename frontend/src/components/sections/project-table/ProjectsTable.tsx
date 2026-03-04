import { RefObject, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import dayjs from 'dayjs';
import DashboardMenu from 'components/common/DashboardMenu';
import { useNavigate } from 'react-router';
import paths from 'routes/paths';
import axios from 'axios';

interface ProjectsTableProps {
    apiRef: RefObject<GridApiCommunity | null>;
    data: any[];
    role: string | null;
    onRefresh: () => void;
}

const importanceLabelMap: Record<number, { label: string; color: 'error' | 'warning' | 'info' | 'success' }> = {
    1: { label: 'Muy Alto', color: 'error' },
    2: { label: 'Alto', color: 'warning' },
    3: { label: 'Medio', color: 'info' },
    4: { label: 'Bajo', color: 'success' },
};

const ProjectsTable = ({ apiRef, data, role, onRefresh }: ProjectsTableProps) => {
    const navigate = useNavigate();

    const handleDelete = async (projectId: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onRefresh();
        } catch (err) {
            console.error('Error al eliminar proyecto', err);
            alert('No se pudo eliminar el proyecto');
        }
    };

    const columns: GridColDef<any>[] = useMemo(() => {
        const base: GridColDef<any>[] = [
            {
                field: 'name',
                headerName: 'Nombre',
                minWidth: 200,
                flex: 1,
            },
            {
                field: 'chief',
                headerName: 'Jefe',
                minWidth: 180,
                flex: 1,
                valueGetter: (_, row) => {
                    const c = row.workGroup?.chief;
                    return c ? `${c.firstName} ${c.lastName}` : 'Sin jefe';
                },
            },
            {
                field: 'members',
                headerName: 'Miembros',
                width: 100,
                align: 'center',
                headerAlign: 'center',
                valueGetter: (_, row) => row.workGroup?.members?.length ?? 0,
                renderCell: (params: GridRenderCellParams<any>) => (
                    <Chip label={params.value} size="small" />
                ),
            },
            {
                field: 'importanceLevel',
                headerName: 'Importancia',
                width: 130,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams<any>) => {
                    const lvl = params.row.importanceLevel;
                    const meta = importanceLabelMap[lvl];
                    return meta ? <Chip label={meta.label} color={meta.color} size="small" /> : <Typography variant="body2">-</Typography>;
                },
            },
            {
                field: 'startDate',
                headerName: 'Inicio',
                width: 130,
                renderCell: (params: GridRenderCellParams<any>) =>
                    params.row.startDate ? (
                        <Typography variant="body2">{dayjs(params.row.startDate).format('DD/MM/YYYY')}</Typography>
                    ) : (
                        <Typography variant="body2" color="text.disabled">-</Typography>
                    ),
            },
            {
                field: 'endDate',
                headerName: 'Fin',
                width: 130,
                renderCell: (params: GridRenderCellParams<any>) =>
                    params.row.endDate ? (
                        <Typography variant="body2">{dayjs(params.row.endDate).format('DD/MM/YYYY')}</Typography>
                    ) : (
                        <Typography variant="body2" color="text.disabled">-</Typography>
                    ),
            },
        ];

        if (role === 'admin' || role === 'project_manager') {
            base.push({
                field: 'action',
                headerName: '',
                filterable: false,
                sortable: false,
                width: 60,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params: GridRenderCellParams<any>) => {
                    const menuItems =
                        role === 'admin'
                            ? [
                                {
                                    label: 'Editar',
                                    onClick: () => navigate(paths.editProject(params.row.id)),
                                },
                                {
                                    label: 'Eliminar',
                                    sx: { color: 'error.main' },
                                    onClick: () => handleDelete(params.row.id),
                                },
                            ]
                            : [
                                {
                                    label: 'Editar',
                                    onClick: () => navigate(paths.editProject(params.row.id)),
                                },
                            ];
                    return <DashboardMenu menuItems={menuItems} />;
                },
            });
        }

        return base;
    }, [role]);

    return (
        <Box sx={{ width: 1 }}>
            <DataGrid
                rowHeight={64}
                rows={data ?? []}
                apiRef={apiRef}
                columns={columns}
                pageSizeOptions={[8]}
                initialState={{ pagination: { paginationModel: { pageSize: 8 } } }}
            />
        </Box>
    );
};

export default ProjectsTable;
