import { Router } from 'express';
import { verificarToken } from '../middleware/auth.js';
import { 
    registrarCuota, 
    obtenerTodasLasCuotas, 
    obtenerCuotasPendientes 
} from '../controllers/cuotaController.js';

const router = Router();

// Endpoints prolijos, declarativos y blindados con Token
router.post('/pagar', verificarToken, registrarCuota);
router.get('/todas', verificarToken, obtenerTodasLasCuotas);
router.get('/todasSinPagar', verificarToken, obtenerCuotasPendientes);

export default router;