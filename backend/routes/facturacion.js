import express from 'express';
import {
  getAllFacturas,
  getFacturaById,
  createFactura,
  updateFacturaEstado,
  registrarPago,
  getDashboardFacturacion,
} from '../controllers/facturacionController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Dashboard
router.get('/dashboard', isAdmin, getDashboardFacturacion);

// Facturas
router.get('/facturas', isAdmin, getAllFacturas);
router.get('/facturas/:id', isAdmin, getFacturaById);
router.post('/facturas', isAdmin, createFactura);
router.put('/facturas/:id/estado', isAdmin, updateFacturaEstado);

// Pagos
router.post('/pagos', isAdmin, registrarPago);

export default router;

