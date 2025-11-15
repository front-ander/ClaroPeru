import express from 'express';
import {
  getAllNodos,
  getNodoById,
  createNodo,
  updateNodo,
  getAllAlertas,
  createAlerta,
  updateAlerta,
  registrarMetrica,
  getMetricasNodo,
  getDashboardRedes,
} from '../controllers/redesController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Dashboard
router.get('/dashboard', isAdmin, getDashboardRedes);

// Nodos
router.get('/nodos', isAdmin, getAllNodos);
router.get('/nodos/:id', isAdmin, getNodoById);
router.post('/nodos', isAdmin, createNodo);
router.put('/nodos/:id', isAdmin, updateNodo);

// Alertas
router.get('/alertas', isAdmin, getAllAlertas);
router.post('/alertas', isAdmin, createAlerta);
router.put('/alertas/:id', isAdmin, updateAlerta);

// Métricas
router.post('/metricas', isAdmin, registrarMetrica);
router.get('/nodos/:id/metricas', isAdmin, getMetricasNodo);

export default router;

