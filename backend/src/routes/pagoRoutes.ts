import express, { Request, Response } from 'express';
const router = express.Router();
import Pago from '../models/Pago'; // Asegurate de que la ruta sea correcta

// RUTA PARA REGISTRAR UN PAGO NUEVO
router.post('/registrar', async (req: Request, res: Response) => {
  try {
    const { socioId, monto, mesReferencia } = req.body;
    const nuevoPago = new Pago({
      socioId,
      monto,
      mesReferencia,
      fecha: new Date()
    });
    await nuevoPago.save();
    res.status(201).json({ mensaje: "Pago registrado con éxito", pago: nuevoPago });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar pago", error });
  }
});

// RUTA PARA TRAER EL HISTORIAL DE UN SOCIO ESPECÍFICO
router.get('/historial/:socioId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { socioId } = req.params;
    const historial = await Pago.find({ socioId }).sort({ fecha: -1 });
    res.json(historial);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al traer historial", error });
  }
});

export default router;