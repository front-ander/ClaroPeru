import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
};

// Admin
export const adminAPI = {
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),
  getAll: () => api.get('/admin'),
  create: (data) => api.post('/admin', data),
  update: (id, data) => api.put(`/admin/${id}`, data),
  delete: (id) => api.delete(`/admin/${id}`),
};

// Practicantes
export const practicanteAPI = {
  getAll: () => api.get('/practicantes'),
  getById: (id) => api.get(`/practicantes/${id}`),
  getByCodigo: (codigo) => api.get(`/practicantes/codigo/${codigo}`),
  create: (data) => api.post('/practicantes', data),
  update: (id, data) => api.put(`/practicantes/${id}`, data),
  delete: (id) => api.delete(`/practicantes/${id}`),
  getMyProfile: () => api.get('/practicantes/me'),
  updateMyProfile: (data) => api.put('/practicantes/me', data),
};

// Asistencias
export const asistenciaAPI = {
  registrar: (data) => api.post('/asistencias', data),
  getAll: (params) => api.get('/asistencias', { params }),
  getHoy: () => api.get('/asistencias/hoy'),
  getMiHistorial: () => api.get('/asistencias/mi-historial'),
  getHistorialPracticante: (id) => api.get(`/asistencias/practicante/${id}`),
  delete: (id) => api.delete(`/asistencias/${id}`),
};

// Reportes
export const reporteAPI = {
  getDashboard: () => api.get('/reportes/dashboard'),
  getTardanzas: (params) => api.get('/reportes/tardanzas', { params }),
  getSalidasTempranas: (params) => api.get('/reportes/salidas-tempranas', { params }),
  getGeneral: (params) => api.get('/reportes/general', { params }),
  getMisEstadisticas: () => api.get('/reportes/mis-estadisticas'),
  getEstadisticasPracticante: (id) => api.get(`/reportes/practicante/${id}`),
};

// Chatbot
export const chatbotAPI = {
  sendMessage: (data) => api.post('/chatbot/message', data),
};

// CRM
export const crmAPI = {
  // Segmentos y Servicios
  getSegmentos: () => api.get('/crm/segmentos'),
  getServicios: (params) => api.get('/crm/servicios', { params }),
  // Clientes
  getAllClientes: (params) => api.get('/crm/clientes', { params }),
  getClienteById: (id) => api.get(`/crm/clientes/${id}`),
  createCliente: (data) => api.post('/crm/clientes', data),
  updateCliente: (id, data) => api.put(`/crm/clientes/${id}`, data),
  // Contratos
  getAllContratos: (params) => api.get('/crm/contratos', { params }),
  createContrato: (data) => api.post('/crm/contratos', data),
  // Tickets
  getAllTickets: (params) => api.get('/crm/tickets', { params }),
  createTicket: (data) => api.post('/crm/tickets', data),
};

// Redes
export const redesAPI = {
  getDashboard: () => api.get('/redes/dashboard'),
  getAllNodos: (params) => api.get('/redes/nodos', { params }),
  getNodoById: (id) => api.get(`/redes/nodos/${id}`),
  createNodo: (data) => api.post('/redes/nodos', data),
  updateNodo: (id, data) => api.put(`/redes/nodos/${id}`, data),
  getAllAlertas: (params) => api.get('/redes/alertas', { params }),
  createAlerta: (data) => api.post('/redes/alertas', data),
  updateAlerta: (id, data) => api.put(`/redes/alertas/${id}`, data),
  registrarMetrica: (data) => api.post('/redes/metricas', data),
  getMetricasNodo: (id, params) => api.get(`/redes/nodos/${id}/metricas`, { params }),
};

// Facturación
export const facturacionAPI = {
  getDashboard: (params) => api.get('/facturacion/dashboard', { params }),
  getAllFacturas: (params) => api.get('/facturacion/facturas', { params }),
  getFacturaById: (id) => api.get(`/facturacion/facturas/${id}`),
  createFactura: (data) => api.post('/facturacion/facturas', data),
  updateFacturaEstado: (id, data) => api.put(`/facturacion/facturas/${id}/estado`, data),
  registrarPago: (data) => api.post('/facturacion/pagos', data),
};

// Analytics
export const analyticsAPI = {
  getDashboard: (params) => api.get('/analytics/dashboard', { params }),
  crearPrediccion: (data) => api.post('/analytics/predicciones', data),
  getPredicciones: (params) => api.get('/analytics/predicciones', { params }),
  getTendenciasVentas: (params) => api.get('/analytics/tendencias-ventas', { params }),
  getAnalisisChurn: () => api.get('/analytics/analisis-churn'),
};

// Ciberseguridad
export const ciberseguridadAPI = {
  getDashboard: () => api.get('/ciberseguridad/dashboard'),
  getAllIncidentes: (params) => api.get('/ciberseguridad/incidentes', { params }),
  getIncidenteById: (id) => api.get(`/ciberseguridad/incidentes/${id}`),
  createIncidente: (data) => api.post('/ciberseguridad/incidentes', data),
  updateIncidente: (id, data) => api.put(`/ciberseguridad/incidentes/${id}`, data),
  registrarAuditoria: (data) => api.post('/ciberseguridad/auditorias', data),
  getAuditorias: (params) => api.get('/ciberseguridad/auditorias', { params }),
};

export default api;
