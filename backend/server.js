import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import practicanteRoutes from './routes/practicante.js';
import asistenciaRoutes from './routes/asistencia.js';
import reporteRoutes from './routes/reporte.js';
import chatbotRoutes from './routes/chatbot.js';
// Módulos avanzados Claro
import crmRoutes from './routes/crm.js';
import redesRoutes from './routes/redes.js';
import facturacionRoutes from './routes/facturacion.js';
import analyticsRoutes from './routes/analytics.js';
import ciberseguridadRoutes from './routes/ciberseguridad.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/practicantes', practicanteRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/chatbot', chatbotRoutes);
// Módulos avanzados Claro
app.use('/api/crm', crmRoutes);
app.use('/api/redes', redesRoutes);
app.use('/api/facturacion', facturacionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ciberseguridad', ciberseguridadRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API Sistema de Asistencia QR - Municipalidad de Piura',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      practicantes: '/api/practicantes',
      asistencias: '/api/asistencias',
      reportes: '/api/reportes',
      chatbot: '/api/chatbot',
      crm: '/api/crm',
      redes: '/api/redes',
      facturacion: '/api/facturacion',
      analytics: '/api/analytics',
      ciberseguridad: '/api/ciberseguridad'
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores general
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏛️  Sistema de Asistencia QR                           ║
║   📍 Municipalidad de Piura                               ║
║   🎓 Practicantes UCV                                     ║
║                                                           ║
║   🚀 Servidor corriendo en: http://localhost:${PORT}       ║
║   📡 Ambiente: ${process.env.NODE_ENV || 'development'}                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
