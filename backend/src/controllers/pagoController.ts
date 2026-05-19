import type { Request, Response } from 'express';
import Pago from '../models/Pago.js';

// 1. REGISTRAR UN PAGO NUEVO (POST)
export const registrarPago = async (req: Request, res: Response) => {
  try {
    const { socioId, monto, mesReferencia } = req.body;
    
    const nuevoPago = new Pago({
      socioId,
      monto,
      mesReferencia,
      fecha: new Date() // Setea automáticamente la fecha y hora exacta del cobro
    });

    await nuevoPago.save();
    res.status(201).json({ mensaje: "Pago registrado con éxito", pago: nuevoPago });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar pago", error });
  }
};

// 2. TRAER EL HISTORIAL DE UN SOCIO ESPECÍFICO (GET)
// 2. TRAER EL HISTORIAL DE UN SOCIO ESPECÍFICO (GET)
export const obtenerHistorialSocio = async (req: Request, res: Response) => {
  try {
    // Al aclararle "as string", TypeScript se queda tranquilo de que es un texto único
    const socioId = req.params.socioId as string;
    
    // El .sort({ fecha: -1 }) hace que los pagos más nuevos aparezcan primero en la lista
    const historial = await Pago.find({ socioId }).sort({ fecha: -1 });
    res.status(200).json(historial);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al traer historial", error });
  }
};