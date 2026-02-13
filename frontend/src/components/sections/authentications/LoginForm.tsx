import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import PasswordTextField from 'components/common/PasswordTextField';

interface LoginFormProps {
  defaultCredential?: { email: string; password: string };
}
const LoginForm = ({ defaultCredential }: LoginFormProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(defaultCredential?.email || '');
  const [password, setPassword] = useState(defaultCredential?.password || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        username,
        password
      });
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    }
  };

  return (
    <Stack
      direction="column"
      sx={{
        height: 1,
        alignItems: 'center',
        justifyContent: 'center', // Changed to center
        pt: { md: 10 },
        pb: 10,
      }}
    >
      <Grid
        container
        sx={{
          maxWidth: '35rem',
          rowGap: 4,
          p: { xs: 3, sm: 5 },
          mb: 5,
        }}
      >
        <Grid size={12}>
          <Typography variant="h4" textAlign="center">Log in</Typography> {/* Added textAlign center */}
        </Grid>

        <Grid size={12}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Grid container>
              {error && (
                <Grid size={12} sx={{ mb: 3 }}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              <Grid
                sx={{
                  mb: 3,
                }}
                size={12}
              >
                <TextField
                  fullWidth
                  size="large"
                  id="username"
                  type="text"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid
                sx={{
                  mb: 3, // Increased margin bottom since Remember Me is gone
                }}
                size={12}
              >
                <PasswordTextField
                  fullWidth
                  size="large"
                  id="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <Button fullWidth type="submit" size="large" variant="contained">
                  Log in
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default LoginForm;
