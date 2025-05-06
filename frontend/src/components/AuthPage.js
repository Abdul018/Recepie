// src/pages/AuthPage.js
import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

/* ---------- brand palette & helpers ---------- */
const COLORS = {
  bg:       '#121212',      // matte‑black base
  surface:  '#1e1e1e',      // slightly lighter cards / inputs
  accent:   '#ff6b00',      // rich orange
  text:     '#ffffff',
  textDim:  '#bdbdbd'
};

const fieldStyle = {
  bgcolor: COLORS.surface,
  input:   { color: COLORS.text },
  label:   { color: COLORS.textDim },
  fieldset:{ borderColor: '#333' },
  '& .MuiOutlinedInput-root:hover fieldset':   { borderColor: COLORS.accent },
  '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: COLORS.accent }
};

/* ---------- small reusable card ---------- */
const AuthCard = ({ title, onSubmit, children }) => (
  <Paper
    component="form"
    onSubmit={onSubmit}
    elevation={4}
    sx={{
      width: '100%',
      maxWidth: 480,
      p: { xs: 4, md: 5 },
      borderRadius: 2,
      bgcolor: COLORS.surface
    }}
  >
    <Typography variant="h5" fontWeight={600} mb={3} color={COLORS.text}>
      {title}
    </Typography>
    <Stack spacing={2}>{children}</Stack>
  </Paper>
);

/* ---------- main page ---------- */
export function AuthPage() {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);

  /* quick‑login form (top bar) */
  const [L, setL] = useState({ username: '', password: '' });
  const handleQuickLogin = e => {
    e.preventDefault();
    login(L.username, L.password)
      .then(() => navigate('/'))
      .catch(() => alert('Login failed'));
  };

  /* sign‑up form */
  const [S, setS] = useState({ username: '', email: '', password: '', confirm: '' });
  const handleSignup = e => {
    e.preventDefault();
    if (S.password !== S.confirm) return alert('Passwords mismatch');
    signup(S.username, S.email, S.password)
      .then(() => navigate('/'))
      .catch(() => alert('Signup failed'));
  };

  return (
    <>
      {/* ────────── Top bar ────────── */}
      <AppBar position="static" sx={{ bgcolor: COLORS.surface, py: 1 }}>
        <Toolbar
          component="form"
          onSubmit={handleQuickLogin}
          sx={{ ml: 'auto', gap: 2 }}
        >
          <TextField
            size="small"
            placeholder="Username or Email"
            value={L.username}
            onChange={e => setL({ ...L, username: e.target.value })}
            variant="outlined"
            sx={{ width: 220, ...fieldStyle }}
          />
          <TextField
            size="small"
            type="password"
            placeholder="Password"
            value={L.password}
            onChange={e => setL({ ...L, password: e.target.value })}
            variant="outlined"
            sx={{ width: 200, ...fieldStyle }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: COLORS.accent,
              '&:hover': { bgcolor: '#e86500' },
              px: 4,
              fontWeight: 600
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* ────────── Body (split layout) ────────── */}
      <Box sx={{ bgcolor: COLORS.bg, minHeight: '100vh' }}>
        <Grid container sx={{ minHeight: 'calc(100vh - 64px)' }}>
          {/* LEFT — hero / copy */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: { xs: 4, md: 10 },
              py: { xs: 8, md: 0 }
            }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              color={COLORS.accent}
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              Bite Delight <span role="img" aria-label="plate">🍽️</span>
            </Typography>

            <Typography
              variant="h6"
              sx={{ maxWidth: 480, lineHeight: 1.5, color: COLORS.textDim }}
            >
              Your ultimate place for personalized recipe discovery. Taste meets
              tech — join our community now and spice up your cooking journey!
            </Typography>
          </Grid>

          {/* RIGHT — sign‑up */}
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              pt: { xs: 6, md: 10 },
              px: { xs: 4, md: 0 }
            }}
          >
            <AuthCard title="Create Your Account" onSubmit={handleSignup}>
              <TextField
                label="Username"
                required
                value={S.username}
                onChange={e => setS({ ...S, username: e.target.value })}
                sx={fieldStyle}
              />
              <TextField
                label="Email Address"
                type="email"
                required
                value={S.email}
                onChange={e => setS({ ...S, email: e.target.value })}
                sx={fieldStyle}
              />
              <TextField
                label="Password"
                type="password"
                required
                value={S.password}
                onChange={e => setS({ ...S, password: e.target.value })}
                sx={fieldStyle}
              />
              <TextField
                label="Confirm Password"
                type="password"
                required
                value={S.confirm}
                onChange={e => setS({ ...S, confirm: e.target.value })}
                sx={fieldStyle}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: 600,
                  bgcolor: COLORS.accent,
                  '&:hover': { bgcolor: '#e86500' }
                }}
              >
                Sign Up
              </Button>
            </AuthCard>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
