import { Router } from 'express';
import { verificarToken } from '../middleware/auth.js';
import { 
    obtenerTodosLosSocios, 
    registrarSocio, 
    editarSocio, 
    eliminarSocio 
} from '../controllers/socioController.js';

const router = Router();

// El archivo de rutas ahora es un mapa impecable y seguro
router.get('/todos', verificarToken, obtenerTodosLosSocios);
router.post('/registrar', verificarToken, registrarSocio);
router.put('/editar/:id', verificarToken, editarSocio); // <-- ¡Ahora con protección de Token!
router.delete('/eliminar/:id', verificarToken, eliminarSocio);

export default router;