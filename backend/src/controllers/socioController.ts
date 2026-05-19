import type { Request, Response } from 'express';
import { Socio } from '../models/Socio.js';

// 1. OBTENER TODOS LOS SOCIOS (GET)
export const obtenerTodosLosSocios = async (req: Request, res: Response) => {
    try {
        const listaSocios = await Socio.find();
        res.status(200).json(listaSocios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los socios", detalle: error });
    }
};

// 2. REGISTRAR UN NUEVO SOCIO (POST)
export const registrarSocio = async (req: Request, res: Response) => {
    try {
        const nuevoSocio = new Socio(req.body); 
        await nuevoSocio.save();
        res.status(201).json({ mensaje: "Socio registrado!", socio: nuevoSocio });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al registrar", detalle: error });
    }
};

// 3. EDITAR UN SOCIO (PUT)
export const editarSocio = async (req: Request, res: Response) => {
    try {
        const idSocio = req.params.id;
        const datosNuevos = req.body;

        const socioEditado = await Socio.findByIdAndUpdate(idSocio, datosNuevos, { new: true });
        res.status(200).json({ mensaje: "Socio actualizado!", socio: socioEditado });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al editar", detalle: error });
    }
};

// 4. ELIMINAR UN SOCIO (DELETE)
export const eliminarSocio = async (req: Request, res: Response) => {
    try {
        const idSocio = req.params.id;
        const socioEliminado = await Socio.findByIdAndDelete(idSocio);

        if (!socioEliminado) {
            return res.status(404).json({ mensaje: "Socio no encontrado" });
        }

        res.status(200).json({ mensaje: "Socio eliminado correctamente", socio: socioEliminado });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al eliminar", detalle: error });
    }
};