import { Router } from 'express';
import { Usuario } from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// RUTA PARA REGISTRAR UN ADMINISTRADOR
router.post('/register', async (req, res) => {
    try {
        const { email, password, nombre } = req.body;

        // 1. Encriptar la contraseña
        // El '10' es el costo del salt (cuántas vueltas de encriptación da)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Crear el usuario con la clave encriptada
        const nuevoUsuario = new Usuario({
            email,
            password: hashedPassword,
            nombre
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "Administrador creado con éxito" });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al registrar usuario", detalle: error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar si el usuario existe
        const usuarioEncontrado = await Usuario.findOne({ email });
        if (!usuarioEncontrado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // 2. Comparar la contraseña ingresada con el hash de la base de datos
        const esValida = await bcrypt.compare(password, usuarioEncontrado.password);
        if (!esValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // 3. Si todo está ok, generar el Token (nuestra "pulsera VIP")
        // Usamos una clave secreta para firmar el token (en producción esto va en un .env)
        const token = jwt.sign(
            { id: usuarioEncontrado._id, nombre: usuarioEncontrado.nombre },
            'MI_CLAVE_SECRETA_SUPER_SEGURA',
            { expiresIn: '2h' } // El pase vence en 2 horas
        );

        res.status(200).json({ mensaje: "Login exitoso", token });

    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", detalle: error });
    }
});

export default router;