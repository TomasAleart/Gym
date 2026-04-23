import { Router } from 'express';
import { Cuota } from '../models/Cuota.js';

const router = Router();

// Registrar una cuota para un socio específico
router.post('/pagar', async (req, res) => {
    try {
        const nuevaCuota = new Cuota(req.body);
        await nuevaCuota.save();
        res.status(201).json({ mensaje: "Pago registrado", cuota: nuevaCuota });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al registrar pago", detalle: error });
    }
});

// Obtener todas las cuotas con la información del socio incluida
router.get('/todas', async (req, res) => {
    try {
        // .find() busca las cuotas
        // .populate('socio') busca el ID en la colección de Socios y trae sus datos
        const cuotas = await Cuota.find().populate('socio');
        
        res.status(200).json(cuotas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener cuotas", detalle: error });
    }
});

router.get('/todasSinPagar', async (req, res) => {
    try {
        // .find() busca las cuotas
        // .populate('socio') busca el ID en la colección de Socios y trae sus datos
        const cuotasPendientes = await Cuota.find({ pagado: false }).populate('socio');
        
        res.status(200).json(cuotasPendientes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener cuotas", detalle: error });
    }
});

export default router;