import { ChangeEvent, MouseEvent, useCallback, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useGridApiRef } from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import axios from 'axios';
import UsersTable from './UsersTable';
import FilterSection from './filters/FilterSection';
import AddUserModal from './AddUserModal';

const UserListContainer = () => {
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const apiRef = useGridApiRef();

  const [role, setRole] = useState<string | null>(null);
  const [usersInfo, setUsersInfo] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);

  useEffect(() => {
    // Determine role (ideally this comes from a context/store, but we fetch from a \"me\" endpoint or decode token if available. For simplicity we will decode a stored role if we had one, or fetch all users and let the backend decide)
    // NOTE: In a real app we'd have a userContext. For now, we will just call /projects/my-projects and see what we get back.
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Let's decode the JWT token to get the role if possible (or just blindly fetch)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        const userRole = decoded.role;
        setRole(userRole);

        if (userRole === 'admin') {
          // Admin can see all users globally
          const res = await axios.get('http://localhost:3000/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsersInfo(res.data);
        } else {
          // Managers and Participants need to select a project first
          const projRes = await axios.get('http://localhost:3000/projects/my-projects', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProjects(projRes.data);
          if (projRes.data.length > 0) {
            setSelectedProjectId(projRes.data[0].id.toString());
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProjectUsers = async () => {
      if ((role === 'project_manager' || role === 'worker') && selectedProjectId) {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`http://localhost:3000/projects/${selectedProjectId}/users`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // map them slightly if needed
          setUsersInfo(res.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchProjectUsers();
  }, [selectedProjectId, role]);

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      apiRef.current?.setQuickFilterValues([e.target.value]);
    },
    [apiRef],
  );

  const handleToggleFilterPanel = (e: MouseEvent<HTMLButtonElement>) => {
    const clickedEl = e.currentTarget;

    if (filterButtonEl && filterButtonEl === clickedEl) {
      setFilterButtonEl(null);
      apiRef.current?.hideFilterPanel();

      return;
    }

    setFilterButtonEl(clickedEl);
    apiRef.current?.showFilterPanel();
  };

  const handleProjectChange = (event: SelectChangeEvent) => {
    setSelectedProjectId(event.target.value);
  };

  return (
    <Grid container spacing={4}>
      <Grid size={12}>
        <Stack
          sx={{
            columnGap: 1,
            rowGap: 2,
            justifyContent: 'space-between',
            alignItems: { xl: 'center' },
            flexWrap: { xs: 'wrap', md: 'nowrap' },
          }}
        >
          {role !== 'worker' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
              sx={{ flexShrink: 0 }}
              onClick={() => setAddUserModalOpen(true)}
            >
              Add User
            </Button>
          )}

          {role !== 'admin' && projects.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 200, flexShrink: 0 }}>
              <InputLabel id="project-select-label">Project</InputLabel>
              <Select
                labelId="project-select-label"
                id="project-select"
                value={selectedProjectId}
                label="Project"
                onChange={handleProjectChange}
              >
                {projects.map((proj: any) => (
                  <MenuItem key={proj.id} value={proj.id.toString()}>{proj.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <StyledTextField
            id="search-box"
            type="search"
            size="medium"
            placeholder="Search user"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon
                      icon="material-symbols:search-rounded"
                      sx={{
                        fontSize: 20,
                        color: 'text.secondary',
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              maxWidth: { sm: 250 },
              minWidth: { sm: 200 },
              order: { xs: 1, sm: 0 },
              flexGrow: 1,
              mr: { md: 'auto' },
              flexBasis: { xs: 'calc(100% - 88px)', sm: 'auto' },
            }}
            onChange={handleSearch}
          />

          <Box sx={{ order: 1, flexShrink: 0, width: { xs: 1, md: 'auto' } }}>
            <FilterSection apiRef={apiRef} handleToggleFilterPanel={handleToggleFilterPanel} />
          </Box>
        </Stack>
      </Grid>

      <Grid size={12}>
        <UsersTable apiRef={apiRef} filterButtonEl={filterButtonEl} data={usersInfo} role={role} />
      </Grid>

      <AddUserModal
        open={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onSuccess={() => {
          setAddUserModalOpen(false);
          window.location.reload();
        }}
      />
    </Grid>
  );
};

export default UserListContainer;
