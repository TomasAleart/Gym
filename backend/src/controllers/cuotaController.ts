import type { Request, Response } from 'express';
import { Cuota } from '../models/Cuota.js';

// 1. REGISTRAR UNA CUOTA PARA UN SOCIO ESPECÍFICO (POST)
export const registrarCuota = async (req: Request, res: Response) => {
    try {
        const nuevaCuota = new Cuota(req.body);
        await nuevaCuota.save();
        res.status(201).json({ mensaje: "Cuota registrada", cuota: nuevaCuota });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al registrar cuota", detalle: error });
    }
};

// 2. OBTENER TODAS LAS CUOTAS CON INFORMACIÓN DEL SOCIO (GET)
export const obtenerTodasLasCuotas = async (req: Request, res: Response) => {
    try {
        // .populate('socio') busca el ID en la colección de Socios y trae sus datos completos
        const cuotas = await Cuota.find().populate('socio');
        res.status(200).json(cuotas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener cuotas", detalle: error });
    }
};

// 3. OBTENER CUOTAS PENDIENTES DE PAGO (GET)
export const obtenerCuotasPendientes = async (req: Request, res: Response) => {
    try {
        const cuotasPendientes = await Cuota.find({ pagado: false }).populate('socio');
        res.status(200).json(cuotasPendientes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener cuotas", detalle: error });
    }
};