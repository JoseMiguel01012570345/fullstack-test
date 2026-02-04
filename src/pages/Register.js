import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { authApi } from '../api/client';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 20;
const PASSWORD_HAS_UPPER = /[A-Z]/;
const PASSWORD_HAS_LOWER = /[a-z]/;
const PASSWORD_HAS_NUMBER = /\d/;

function validatePassword(pwd) {
  if (pwd.length < PASSWORD_MIN || pwd.length > PASSWORD_MAX)
    return `La contraseña debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres.`;
  if (!PASSWORD_HAS_UPPER.test(pwd)) return 'La contraseña debe tener al menos una mayúscula.';
  if (!PASSWORD_HAS_LOWER.test(pwd)) return 'La contraseña debe tener al menos una minúscula.';
  if (!PASSWORD_HAS_NUMBER.test(pwd)) return 'La contraseña debe tener números.';
  return null;
}

export default function Register() {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('El usuario es obligatorio.');
      return;
    }
    if (!email.trim()) {
      setError('El correo es obligatorio.');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError('Ingrese un correo válido.');
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    setLoading(true);
    try {
      await authApi.register(username.trim(), email.trim(), password);
      history.push('/login');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Hubo un inconveniente con la transacción. Intente de nuevo.'
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
            Registro
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Dirección de correo"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              helperText="Entre 8 y 20 caracteres, con números, mayúscula y minúscula"
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2, backgroundColor: '#2196f3', 
                backgroundColor: '#2196f3', color: 'white',
                fontFamily: 'inherit',
                fontWeight: 'bold',}}
              disabled={loading}
            >
              REGISTRARSE
            </Button>
          </form>
          { !loading && <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            ¿Ya tiene cuenta? <Link to="/login">Iniciar sesión</Link>
          </Typography> }
        </CardContent>
      </Card>
    </Box>
  );
}
