import { Router } from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/authController.js';

const router = Router();

// Ahora el archivo de rutas es un índice limpio y declarativo
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

export default router;