import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    // 1. Obtener el token de los encabezados (Headers)
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });
    }

    try {
        // 2. Verificar si el token es real y no expiró
        const verificado = jwt.verify(token, 'MI_CLAVE_SECRETA_SUPER_SEGURA');
        
        // 3. Si es correcto, guardamos los datos del usuario en el pedido para usarlo después
        (req as any).user = verificado;
        
        // 4. ¡Continuar a la ruta!
        next();
    } catch (error) {
        res.status(400).json({ mensaje: "Token no válido" });
    }
};