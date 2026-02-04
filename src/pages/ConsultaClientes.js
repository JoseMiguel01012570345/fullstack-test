import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { clienteApi } from '../api/client';

export default function ConsultaClientes() {
  const history = useHistory();
  const { userid } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [filtroIdentificacion, setFiltroIdentificacion] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, cliente: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const buscar = useCallback(async () => {
    if (!userid) return;
    setLoading(true);
    let auxClients = clientes
    setClientes([])
    try {
      const { data } = await clienteApi.listado({
        usuarioId: userid,
        identificacion: filtroIdentificacion || undefined,
        nombre: filtroNombre || undefined,
      });
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Hubo un inconveniente con la transacción.',
        severity: 'error',
      });
      setClientes(auxClients);
    } finally {
      setLoading(false);
    }
  }, [userid, filtroIdentificacion, filtroNombre]);

  const handleEliminar = () => {
    if (!deleteModal.cliente) return;
    const id = deleteModal.cliente.id;
    setDeleteModal({ open: false, cliente: null });
    clienteApi
      .eliminar(id)
      .then(() => {
        setSnackbar({ open: true, message: 'El proceso se realizó correctamente.', severity: 'success' });
        buscar();
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: 'Hubo un inconveniente con la transacción.',
          severity: 'error',
        });
      });
  };

  return (
    <Layout>
      <Box >
        <Paper sx={{ p: 2, mb: 2, borderRadius: '0px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Consulta Clientes
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => history.push('/clientes/mantenimiento')}
              >
                Agregar
              </Button>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => history.push('/home')}
              >
                Regresar
              </Button>
            </Box>
          </Box>
          <Box sx={{ width: '100%', my: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <TextField
              label="Nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Identificación"
              value={filtroIdentificacion}
              onChange={(e) => setFiltroIdentificacion(e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <Button
              variant="contained"
              onClick={buscar}
              disabled={loading}
              sx={{
                minWidth: 55,
                minHeight: 55,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
                border: '1px solid black',
                color: 'black',
                fontFamily: 'inherit',
                fontWeight: 'bold',
              }}
            >
              <SearchIcon />
            </Button>
          </Box>
        <Box sx={{ width: '100%', my: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
        </Box>
        <TableContainer>
          <Table 
            sx={{ 
              border: 'solid 1px #ccc',
              '& td, & th': { borderRight: '1px solid #ccc' },
              '& td:last-child, & th:last-child': { borderRight: 0 },
              mb: 2
            }}
            size="small"
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.08rem', backgroundColor: '#2196f3', color: '#fff' }}>Identificación</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.08rem', backgroundColor: '#2196f3', color: '#fff' }}>Nombre</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.08rem', backgroundColor: '#2196f3', color: '#fff' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Use Buscar para cargar el listado.
                  </TableCell>
                </TableRow>
              ): loading  &&
              <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow> }
              {clientes.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.identificacion || '-'}</TableCell>
                  <TableCell>{row.nombre || '-'}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      width: 80,
                      maxWidth: 80,
                      minWidth: 60,
                      padding: '0 8px'
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => history.push(`/clientes/mantenimiento/${row.id}`)}
                      title="Editar"
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteModal({ open: true, cliente: row })}
                      title="Eliminar"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>
      </Box>
      <Dialog open={deleteModal.open} onClose={() => setDeleteModal({ open: false, cliente: null })}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContentText sx={{ px: 3 }}>
          ¿Está seguro de eliminar al cliente{' '}
          {deleteModal.cliente
            ? `${deleteModal.cliente.nombre || ''} ${deleteModal.cliente.apellidos || ''}`.trim() || 'seleccionado'
            : ''}
          ?
        </DialogContentText>
        <DialogActions>
          <Button onClick={() => setDeleteModal({ open: false, cliente: null })}>Cancelar</Button>
          <Button onClick={handleEliminar} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
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
