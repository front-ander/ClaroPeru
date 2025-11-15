import express from 'express';
import {
  getAllIncidentes,
  getIncidenteById,
  createIncidente,
  updateIncidente,
  registrarAuditoria,
  getAuditorias,
  getDashboardCiberseguridad,
} from '../controllers/ciberseguridadController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Dashboard
router.get('/dashboard', isAdmin, getDashboardCiberseguridad);

// Incidentes
router.get('/incidentes', isAdmin, getAllIncidentes);
router.get('/incidentes/:id', isAdmin, getIncidenteById);
router.post('/incidentes', isAdmin, createIncidente);
router.put('/incidentes/:id', isAdmin, updateIncidente);

// Auditorías
router.post('/auditorias', registrarAuditoria); // Puede ser usado por el sistema automáticamente
router.get('/auditorias', isAdmin, getAuditorias);

export default router;

