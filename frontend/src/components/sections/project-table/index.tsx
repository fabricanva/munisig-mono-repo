import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useGridApiRef } from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import axios from 'axios';
import ProjectsTable from './ProjectsTable';
import { useNavigate } from 'react-router';
import paths from 'routes/paths';

const API = 'http://localhost:3000';

const ProjectListContainer = () => {
    const apiRef = useGridApiRef();
    const [role, setRole] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const navigate = useNavigate();

    const fetchProjects = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''),
            );
            const decoded = JSON.parse(jsonPayload);
            setRole(decoded.role);

            const res = await axios.get(`${API}/projects`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            apiRef.current?.setQuickFilterValues([e.target.value]);
        },
        [apiRef],
    );

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
                    {role === 'admin' && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
                            sx={{ flexShrink: 0 }}
                            onClick={() => navigate(paths.createProject)}
                        >
                            Crear Proyecto
                        </Button>
                    )}

                    <StyledTextField
                        id="search-projects"
                        type="search"
                        size="medium"
                        placeholder="Buscar proyecto..."
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconifyIcon icon="material-symbols:search-rounded" sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            maxWidth: { sm: 280 },
                            minWidth: { sm: 200 },
                            flexGrow: 1,
                            mr: { md: 'auto' },
                        }}
                        onChange={handleSearch}
                    />
                </Stack>
            </Grid>

            <Grid size={12}>
                <Box sx={{ width: 1 }}>
                    <ProjectsTable apiRef={apiRef} data={projects} role={role} onRefresh={fetchProjects} />
                </Box>
            </Grid>
        </Grid>
    );
};

export default ProjectListContainer;
