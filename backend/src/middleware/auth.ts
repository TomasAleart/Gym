import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config'; // <-- 1. Importante: Esto carga el archivo .env

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });
    }

    try {
        // 2. Usamos la variable de entorno. 
        // El "as string" le asegura a TS que la variable existe.
        const secret = process.env.JWT_SECRET as string; 
        const verificado = jwt.verify(token, secret);
        
        (req as any).user = verificado;
        next();
    } catch (error) {
        res.status(400).json({ mensaje: "Token no válido" });
    }
};