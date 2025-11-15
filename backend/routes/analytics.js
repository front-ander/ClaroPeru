import express from 'express';
import {
  getDashboardAnalytics,
  crearPrediccion,
  getPredicciones,
  getTendenciasVentas,
  getAnalisisChurn,
} from '../controllers/analyticsController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken, isAdmin);

// Dashboard Analytics
router.get('/dashboard', getDashboardAnalytics);

// Predicciones IA
router.post('/predicciones', crearPrediccion);
router.get('/predicciones', getPredicciones);

// Análisis
router.get('/tendencias-ventas', getTendenciasVentas);
router.get('/analisis-churn', getAnalisisChurn);

export default router;

