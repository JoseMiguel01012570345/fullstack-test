import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';

const REMEMBER_KEY = 'rememberUsername';

export default function Login() {
  const history = useHistory();
  const { setAuth, isAuthenticated, STORAGE_KEYS } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      history.replace('/home');
      return;
    }
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setUsername(saved);
      setRemember(true);
    }
  }, [isAuthenticated, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Usuario y contraseña son requeridos.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.login(username, password);
      setAuth({ token: data.token, userid: data.userid, username: data.username });
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, username);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      history.push('/home');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Hubo un inconveniente con la transacción. Verifique sus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom align="center">
            Iniciar sesión
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              autoComplete="username"
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              autoComplete="current-password"
              disabled={loading}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  color="primary"
                />
              }
              label="Recuérdame"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2, backgroundColor: '#2196f3', color: 'white',
                fontFamily: 'inherit',
                fontWeight: 'bold',}}
              disabled={loading}
            >
              INICIAR SESIÓN
            </Button>
          </form>
          { !loading && <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            ¿No tiene una cuenta? <Link to="/register">Regístrese</Link>
          </Typography>}
        </CardContent>
      </Card>
    </Box>
  );
}
