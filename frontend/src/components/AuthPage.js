import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Card = ({ title, onSubmit, children }) => (
  <Paper sx={{ p: 3, width: 320 }} component="form" onSubmit={onSubmit}>
    <Typography variant="h6" align="center" mb={2}>{title}</Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</Box>
  </Paper>
);

export function AuthPage() {
  const nav = useNavigate();
  const { login, signup } = useContext(AuthContext);

  const [L, setL] = useState({ username: '', password: '' });
  const loginSubmit = e => { e.preventDefault(); login(L.username, L.password).then(() => nav('/')).catch(() => alert('Login failed')); };

  const [S, setS] = useState({ username: '', email: '', password: '', confirm: '' });
  const signupSubmit = e => {
    e.preventDefault();
    if (S.password !== S.confirm) return alert('Passwords mismatch');
    signup(S.username, S.email, S.password).then(() => nav('/')).catch(() => alert('Signup failed'));
  };

  return (
    <>
      {/* ────────── Top bar (quick login) ────────── */}
      <AppBar position="static" sx={{ bgcolor: '#262c38', py: 1 }}>
        <Toolbar sx={{ ml: 'auto', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Username or Email"
            value={L.username}
            onChange={e => setL({ ...L, username: e.target.value })}
            variant="outlined"
            sx={{ bgcolor: 'white', borderRadius: 1, width: 220 }}
          />
          <TextField
            size="small"
            type="password"
            placeholder="Password"
            value={L.password}
            onChange={e => setL({ ...L, password: e.target.value })}
            variant="outlined"
            sx={{ bgcolor: 'white', borderRadius: 1, width: 200 }}
          />
          <Button
            onClick={loginSubmit}
            variant="contained"
            color="warning"
            sx={{ px: 4, fontWeight: 600 }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Box
    sx={{
      /* ── background image settings ── */
      backgroundImage: 'url(.\frontend\public\food-bg.jpg.jpeg)',   //  <-- put your file here
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',

      /* ensures the image spans full height under the app-bar */
      minHeight: '100vh',
    }}
  >
      {/* ────────── Split screen ────────── */}
      <Grid container sx={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* LEFT — brand/message  (≈ 5 / 12 width on desktop) */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            bgcolor: '#eef6f7',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            pl: { xs: 4, md: 10 },
            pr: { xs: 4, md: 4 },
            py: { xs: 6, md: 0 },
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            color="#ff6347"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Bite Delight <span role="img" aria-label="plate">🍽️</span>
          </Typography>
  
          <Typography variant="h6" sx={{ maxWidth: 460, lineHeight: 1.4 }}>
            Your ultimate place for personalized recipe discovery. Taste meets
            tech&nbsp;— join our community now and spice up your cooking journey!
          </Typography>
        </Grid>
  
        {/* RIGHT — sign-up card (≈ 7 / 12 width on desktop) */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            mx: 'auto',
            pt: { xs: 6, md: 10 },
            px: { xs: 4, md: 0 },
          }}
        >
          <Paper
            component="form"
            onSubmit={signupSubmit}
            elevation={3}
            sx={{
              width: '100%',
              maxWidth: 480,
              borderRadius: 2,
              p: { xs: 4, md: 5 },
            }}
          >
            <Typography variant="h5" fontWeight={600} mb={3}>
              Create Your Account
            </Typography>
  
            <Stack spacing={1}>
              <TextField
                fullWidth
                label="Username"
                required
                value={S.username}
                onChange={e => setS({ ...S, username: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                required
                value={S.email}
                onChange={e => setS({ ...S, email: e.target.value })}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                required
                value={S.password}
                onChange={e => setS({ ...S, password: e.target.value })}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                required
                value={S.confirm}
                onChange={e => setS({ ...S, confirm: e.target.value })}
              />
  
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  bgcolor: '#4CAF50',
                  '&:hover': { bgcolor: '#449949' },
                  fontWeight: 600,
                  py: 1.2,
                }}
                fullWidth
              >
                Sign Up
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      </Box>
    </>
  );
}  