import { Router } from 'express';
import { verificarToken } from '../middleware/auth.js';
import { registrarPago, obtenerHistorialSocio } from '../controllers/pagoController.js';

const router = Router();

// Rutas declarativas y protegidas con tu "pulsera VIP" (Token)
router.post('/registrar', verificarToken, registrarPago);
router.get('/historial/:socioId', verificarToken, obtenerHistorialSocio);

export default router;