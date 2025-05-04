import React, { useState, useContext } from 'react';
import { Grid, Paper, Typography, TextField, Button, Box } from '@mui/material';
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
    <Grid container minHeight="100vh" alignItems="center" justifyContent="center" spacing={4}>
      <Grid item xs={12} textAlign="center"><Typography variant="h4" fontWeight={600}>Bite Delight</Typography></Grid>

      <Grid item><Card title="Sign Up" onSubmit={signupSubmit}>
        <TextField label="Username" value={S.username} onChange={e => setS({ ...S, username: e.target.value })} required />
        <TextField label="Email" type="email" value={S.email} onChange={e => setS({ ...S, email: e.target.value })} required />
        <TextField label="Password" type="password" value={S.password} onChange={e => setS({ ...S, password: e.target.value })} required />
        <TextField label="Confirm" type="password" value={S.confirm} onChange={e => setS({ ...S, confirm: e.target.value })} required />
        <Button variant="contained" color="warning" type="submit">Register</Button>
      </Card></Grid>

      <Grid item><Card title="Login" onSubmit={loginSubmit}>
        <TextField label="Username" value={L.username} onChange={e => setL({ ...L, username: e.target.value })} required />
        <TextField label="Password" type="password" value={L.password} onChange={e => setL({ ...L, password: e.target.value })} required />
        <Button variant="contained" color="warning" type="submit">Login</Button>
      </Card></Grid>
    </Grid>
  );
}
