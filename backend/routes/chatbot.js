import express from 'express';
import { sendMessage } from '../controllers/chatbotController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Enviar mensaje al chatbot
router.post('/message', sendMessage);

export default router;

