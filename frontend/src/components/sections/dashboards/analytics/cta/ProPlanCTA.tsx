import { Paper, Stack, Typography, Box } from '@mui/material';

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
        <Stack
          direction="column"
          gap={0.5}
          sx={{
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              typography: { xs: 'h4', sm: 'h3' },
              flexShrink: { sm: 0 },
              textAlign: 'center',
            }}
          >
            Discover More with Our Pro License
          </Typography>

          <Stack gap={1} sx={{ alignItems: 'center' }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
              }}
            >
              Starts from only
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'success.dark',
              }}
            >
              $59
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ProPlanCTA;
