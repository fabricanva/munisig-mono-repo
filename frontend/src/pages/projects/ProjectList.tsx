import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import paths from 'routes/paths';
import ProjectListContainer from 'components/sections/project-table';
import PageHeader from 'components/sections/user-table/PageHeader';

const ProjectList = () => {
    return (
        <Stack direction="column" height={1}>
            <PageHeader
                title="Proyectos"
                breadcrumb={[
                    { label: 'Home', url: paths.root },
                    { label: 'Proyectos', active: true },
                ]}
            />
            <Paper sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
                <ProjectListContainer />
            </Paper>
        </Stack>
    );
};

export default ProjectList;
