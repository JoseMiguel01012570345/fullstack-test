import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Avatar,
  InputLabel,
  FormControl,
  Select,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { clienteApi, interesesApi } from '../api/client';

const SEXO_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
];

function toDateInput(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function toApiDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function MantenimientoCliente() {
  const history = useHistory();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { userid } = useAuth();

  const [intereses, setIntereses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imagenBase64, setImagenBase64] = useState('');
  const [phoneErrors, setPhoneErrors] = useState({ telefonoCelular: false, otroTelefono: false });
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    identificacion: '',
    telefonoCelular: '',
    otroTelefono: '',
    direccion: '',
    fNacimiento: '',
    fAfiliacion: '',
    sexo: '',
    resenaPersonal: '',
    interesFK: '',
  });

  const validatePhoneNumber = (value) => {
    if (!value) return false;
    const digits = String(value).replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [interesesRes] = await Promise.all([
          interesesApi.listado(),
          isEdit ? clienteApi.obtener(id) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        const list = interesesRes.data;
        setIntereses(Array.isArray(list) ? list : []);
        if (isEdit && id) {
          const clienteRes = await clienteApi.obtener(id);
          if (cancelled) return;
          const c = clienteRes.data;
          setForm({
            nombre: c.nombre || '',
            apellidos: c.apellidos || '',
            identificacion: c.identificacion || '',
            telefonoCelular: c.telefonoCelular || '',
            otroTelefono: c.otroTelefono || '',
            direccion: c.direccion || '',
            fNacimiento: toDateInput(c.fNacimiento),
            fAfiliacion: toDateInput(c.fAfiliacion),
            sexo: c.sexo || '',
            resenaPersonal: c.resenaPersonal || '',
            interesFK: c.interesesId || '',
          });
          setImagenBase64(c.imagen || '');
        }
      } catch (err) {
        if (!cancelled) {
          setSnackbar({
            open: true,
            message: 'No se pudieron cargar las opciones de intereses',
            severity: 'error',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isEdit, id]);

  const validateDates = (e, field) => {
    if(field == 'fNacimiento'){
      let dateBorn =  new Date(e.target.value)
      let dateAff = new Date(form.fAfiliacion)
      if(dateBorn >= dateAff){
        return false
    }}
    if(field == 'fAfiliacion'){
      let dateBorn =  new Date(form.fNacimiento)
      let dateAff = new Date(e.target.value)
      if(dateBorn >= dateAff){
        return false
    }}
    return true
  }

  const handleChange = (field) => (e) => {
    let isValid = true
    if(field === 'fNacimiento' && e.target.value && form.fAfiliacion){
      isValid = validateDates(e, field)
    }
    if(field === 'fAfiliacion' && e.target.value && form.fNacimiento){
      isValid = validateDates(e, field)
    }
    if(isValid){
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setImagenBase64(typeof result === 'string' ? result : '');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      nombre,
      apellidos,
      identificacion,
      telefonoCelular,
      otroTelefono,
      direccion,
      fNacimiento,
      fAfiliacion,
      sexo,
      resenaPersonal,
      interesFK,
    } = form;
    if (
      !nombre?.trim() ||
      !apellidos?.trim() ||
      !identificacion?.trim() ||
      !telefonoCelular?.trim() ||
      !otroTelefono?.trim() ||
      !direccion?.trim() ||
      !fNacimiento ||
      !fAfiliacion ||
      !sexo ||
      !resenaPersonal?.trim() ||
      !interesFK
    ) {
      setSnackbar({
        open: true,
        message: 'Todos los campos obligatorios deben estar completos.',
        severity: 'warning',
      });
      return;
    }

    // Validar formatos de teléfono antes de continuar
    if (!validatePhoneNumber(telefonoCelular) || !validatePhoneNumber(otroTelefono)) {
      setSnackbar({
        open: true,
        message: 'Ingrese números de teléfono válidos.',
        severity: 'warning',
      });
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await clienteApi.actualizar({
          id,
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          identificacion: identificacion.trim(),
          celular: telefonoCelular.trim(),
          otroTelefono: otroTelefono.trim(),
          direccion: direccion.trim(),
          fNacimiento: toApiDate(fNacimiento),
          fAfiliacion: toApiDate(fAfiliacion),
          sexo,
          resennaPersonal: resenaPersonal.trim(),
          imagen: imagenBase64 || null,
          interesFK,
          usuarioId: userid,
        });
      } else {
        await clienteApi.crear({
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          identificacion: identificacion.trim(),
          celular: telefonoCelular.trim(),
          otroTelefono: otroTelefono.trim(),
          direccion: direccion.trim(),
          fNacimiento: toApiDate(fNacimiento),
          fAfiliacion: toApiDate(fAfiliacion),
          sexo,
          resennaPersonal: resenaPersonal.trim(),
          imagen: imagenBase64 || null,
          interesFK,
          usuarioId: userid,
        });
      }
      setSnackbar({
        open: true,
        message: 'El proceso se realizó correctamente.',
        severity: 'success',
      });
      history.push('/clientes');
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Hubo un inconveniente con la transacción.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><Typography sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '30px',
    fontWeight: 'bold'
  }}
      >Cargando...
    </Typography></Layout>;

  return (
    <Layout>
      <Box>
        <Paper sx={{ p: 3, borderRadius: '0px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button startIcon={
                    <Avatar
                    src={imagenBase64 || undefined}
                    sx={{ width: 100, height: 100, borderRadius: '50%' }}
                    variant="rounded"
                  />
                  }
                 component="label" size="small">
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
              </Box>
              <Typography variant="h5" gutterBottom>
                Mantenimiento de clientes
              </Typography>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={saving}
                    onClick={(e) => handleSubmit(e)}
                  >
                    Guardar
                  </Button>
                  <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => history.push('/clientes')}>
                    Regresar
                  </Button>
              </Box>
            <Box sx={{ width: '100%', my: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', gap: 2, flex: 2 }}>
                <TextField
                  fullWidth
                  label="Identificación *"
                  value={form.identificacion}
                  onChange={handleChange('identificacion')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Nombre *"
                  value={form.nombre}
                  onChange={handleChange('nombre')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Apellidos *"
                  value={form.apellidos}
                  onChange={handleChange('apellidos')}
                  margin="normal"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flex: 2 }}>
              <FormControl fullWidth margin="normal">
                  <InputLabel>Sexo *</InputLabel>
                  <Select
                    value={form.sexo}
                    onChange={handleChange('sexo')}
                    label="Sexo *"
                  >
                    {SEXO_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Fecha de nacimiento *"
                  type="date"
                  value={form.fNacimiento}
                  onChange={handleChange('fNacimiento')}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Fecha de afiliación *"
                  type="date"
                  value={form.fAfiliacion}
                  onChange={handleChange('fAfiliacion')}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flex: 2 }}>
                <TextField
                  fullWidth
                  label="Teléfono celular *"
                  value={form.telefonoCelular}
                  onChange={handleChange('telefonoCelular')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Otro teléfono *"
                  value={form.otroTelefono}
                  onChange={handleChange('otroTelefono')}
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Intereses *</InputLabel>
                  <Select
                    value={form.interesFK}
                    onChange={handleChange('interesFK')}
                    label="Intereses *"
                  >
                    {intereses.map((i) => (
                      <MenuItem key={i.id} value={i.id}>
                        {i.descripcion || '(Sin descripción)'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <TextField
                fullWidth
                label="Dirección *"
                value={form.direccion}
                onChange={handleChange('direccion')}
                margin="normal"
                inputProps={{ maxLength: 200 }}
              />
              <TextField
                fullWidth
                label="Reseña personal *"
                value={form.resenaPersonal}
                onChange={handleChange('resenaPersonal')}
                margin="normal"
                multiline
                inputProps={{ maxLength: 200 }}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Layout>
  );
}
