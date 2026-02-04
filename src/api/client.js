import axios from 'axios';

const API_BASE = 'https://pruebareactjs.test-class.com/Api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userid');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (username, password) =>
    apiClient.post('/api/Authenticate/login', { username, password }),
  register: (username, email, password) =>
    apiClient.post('/api/Authenticate/register', { username, email, password }),
};

export const clienteApi = {
  listado: (body) => apiClient.post('/api/Cliente/Listado', body),
  obtener: (idCliente) => apiClient.get(`/api/Cliente/Obtener/${idCliente}`),
  crear: (body) => apiClient.post('/api/Cliente/Crear', body),
  actualizar: (body) => apiClient.post('/api/Cliente/Actualizar', body),
  eliminar: (idCliente) => apiClient.delete(`/api/Cliente/Eliminar/${idCliente}`),
};

export const interesesApi = {
  listado: () => apiClient.get('/api/Intereses/Listado'),
};

export default apiClient;
