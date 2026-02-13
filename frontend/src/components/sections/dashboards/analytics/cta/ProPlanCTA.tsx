import { Paper, Stack, Box } from '@mui/material';

const ProPlanCTA = () => {
  return (
    <Paper
      sx={{
        p: { xs: 3, md: 5 },
        height: 1,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        sx={{ position: 'absolute', inset: 0, height: 1, width: 1, zIndex: -1, bgcolor: 'background.paper', opacity: 0.8 }}
      />
      <Stack
        direction="column"
        gap={4}
        sx={{
          alignItems: 'center',
        }}
      >
      </Stack>
    </Paper>
  );
};

export default ProPlanCTA;
