import express from 'express';
import {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  getAllContratos,
  createContrato,
  getAllTickets,
  createTicket,
  getSegmentos,
  getServicios,
} from '../controllers/crmController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Segmentos y Servicios (lectura para todos)
router.get('/segmentos', getSegmentos);
router.get('/servicios', getServicios);

// Clientes
router.get('/clientes', isAdmin, getAllClientes);
router.get('/clientes/:id', isAdmin, getClienteById);
router.post('/clientes', isAdmin, createCliente);
router.put('/clientes/:id', isAdmin, updateCliente);

// Contratos
router.get('/contratos', isAdmin, getAllContratos);
router.post('/contratos', isAdmin, createContrato);

// Tickets de Soporte
router.get('/tickets', isAdmin, getAllTickets);
router.post('/tickets', isAdmin, createTicket);

export default router;

