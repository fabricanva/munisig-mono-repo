import { Box, Button, Stack, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';

const Page404 = () => {
  const { up } = useBreakpoints();
  const upSm = up('sm');
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: { xs: 2.5, sm: 5 },
      }}
    >
      <Stack
        direction="column"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            mb: 6,
            width: {
              xs: 300,
              sm: 500,
              md: 800,
            },
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h1" sx={{ fontSize: '10rem', opacity: 0.1 }}>404</Typography>
        </Box>
        <Box
          sx={[
            {
              textAlign: 'center',
            },
            !upSm && {
              maxWidth: 340,
              mx: 'auto',
            },
          ]}
        >
          <Typography
            variant="h2"
            sx={{
              color: 'text.disabled',
              fontWeight: 'medium',
              mb: 2,
              fontSize: { xs: 'h4.fontSize', sm: 'h2.fontSize' },
            }}
          >
            Page not found
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              fontWeight: 'normal',
              mb: 5,
              fontSize: { xs: 'subtitle1.fontSize', sm: 'h5.fontSize' },
            }}
          >
            No worries! Let’s take you back{' '}
            <Box
              component="br"
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
              }}
            />
            while our bear is searching everywhere
          </Typography>

          <Button variant="contained" href="/" size={upSm ? 'large' : 'medium'} sx={{ px: 7 }}>
            Go Back Home{' '}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Page404;
