import { RefObject, useMemo } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import dayjs from 'dayjs';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';
import EditUserModal from './EditUserModal';
import { useState } from 'react';

interface UsersTableProps {
  apiRef: RefObject<GridApiCommunity | null>;
  filterButtonEl: HTMLButtonElement | null;
  data: any[];
  role: string | null;
}

const UsersTable = ({ apiRef, filterButtonEl, data, role }: UsersTableProps) => {
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const columns: GridColDef<any>[] = useMemo(() => {
    const baseColumns: GridColDef<any>[] = [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 64,
      },
      {
        field: 'avatar',
        headerName: 'Avatar',
        width: 64,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: GridRenderCellParams<any>) => (
          <Tooltip title={params.row.firstName || params.row.name || 'User'}>
            <Avatar
              src={params.row.avatar}
              alt={params.row.firstName || params.row.name}
              sx={{
                width: 32,
                height: 32,
              }}
            />
          </Tooltip>
        ),
      },
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 160,
        flex: 1,
        valueGetter: (_, row) => row.firstName && row.lastName ? `${row.firstName} ${row.lastName}` : (row.username || row.name || 'Unknown'),
      },
      {
        field: 'email',
        headerName: 'Email',
        minWidth: 230,
        flex: 1,
        valueGetter: (_, row) => row.email || row.user?.username || 'No Email',
        renderCell: (params: GridRenderCellParams<any>) => (
          <Link href={`mailto:${params.row.email || params.row.user?.username}`} variant="body2">
            {params.row.email || params.row.user?.username || 'No Email'}
          </Link>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: GridRenderCellParams<any>) => (
          <Chip
            label={params.row.isActive || params.row.status === 'online' ? 'Active' : 'Offline'}
            color={params.row.isActive || params.row.status === 'online' ? 'success' : 'error'}
            sx={{
              textTransform: 'capitalize',
            }}
          />
        ),
      },
      {
        field: 'role',
        headerName: 'Role',
        width: 130,
        renderCell: (params: GridRenderCellParams<any>) => <Chip label={params.row.user?.role || params.row.role || 'Personnel'} />,
      },
      {
        field: 'department',
        headerName: 'Department',
        width: 150,
        valueGetter: (_, row) => row.functionRole || row.department || '-',
      },
      {
        field: 'phone',
        headerName: 'Phone',
        width: 160,
        sortable: false,
        filterable: false,
        valueGetter: (_, row) => row.phone || '-',
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        width: 200,
        renderCell: (params: GridRenderCellParams<any>) => (
          <Typography>{dayjs(params.row.createdAt || new Date()).format('DD MMMM, YYYY')}</Typography>
        ),
      },
    ];

    if (role !== 'worker') {
      baseColumns.push({
        field: 'action',
        headerName: '',
        filterable: false,
        sortable: false,
        width: 60,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams<any>) => {
          const menuItems = role === 'admin'
            ? [
              {
                label: 'Edit',
                onClick: () => {
                  setSelectedUser(params.row);
                  setEditUserModalOpen(true);
                }
              },
              { label: 'Delete', sx: { color: 'error.main' } }
            ]
            : [{ label: 'Remove from Project', sx: { color: 'error.main' } }];

          return <DashboardMenu menuItems={menuItems} />;
        },
      });
    }

    return baseColumns;
  }, [role]);

  return (
    <Box sx={{ width: 1 }}>
      <DataGrid
        rowHeight={64}
        rows={data && data.length > 0 ? data : []}
        apiRef={apiRef}
        columns={columns}
        pageSizeOptions={[8]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        checkboxSelection={role !== 'worker'}
        slots={{
          basePagination: (props) => <DataGridPagination showFullPagination {...props} />,
        }}
        slotProps={{
          panel: {
            target: filterButtonEl,
          },
        }}
      />
      <EditUserModal
        open={editUserModalOpen}
        user={selectedUser}
        onClose={() => setEditUserModalOpen(false)}
        onSuccess={() => {
          setEditUserModalOpen(false);
          window.location.reload();
        }}
      />
    </Box>
  );
};

export default UsersTable;
