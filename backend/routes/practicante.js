import express from 'express';
import {
  getAllPracticantes,
  getPracticanteById,
  createPracticante,
  updatePracticante,
  deletePracticante,
  getMyProfile,
  updateMyProfile,
  getPracticanteByCodigo
} from '../controllers/practicanteController.js';
import { verifyToken, isAdmin, isPracticante } from '../middleware/auth.js';

const router = express.Router();

// Rutas para practicantes (sobre sí mismos)
router.get('/me', verifyToken, isPracticante, getMyProfile);
router.put('/me', verifyToken, isPracticante, updateMyProfile);


// Rutas para administradores (gestión de practicantes)
router.get('/', verifyToken, isAdmin, getAllPracticantes);
router.get('/codigo/:codigo', verifyToken, isAdmin, getPracticanteByCodigo);
router.get('/:id', verifyToken, isAdmin, getPracticanteById);
router.post('/', verifyToken, isAdmin, createPracticante);
router.put('/:id', verifyToken, isAdmin, updatePracticante);
router.delete('/:id', verifyToken, isAdmin, deletePracticante);

export default router;
