import type { Request, Response } from 'express';
import { Usuario } from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// --- LOGICA DE REGISTRO ---
export const registrarUsuario = async (req: Request, res: Response) => {
  try {
    const { email, password, nombre } = req.body;

    // 1. Encriptar la contraseña
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
};

// --- LOGICA DE LOGIN ---
export const loginUsuario = async (req: Request, res: Response) => {
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

    // 3. Generar el Token (nuestra "pulsera VIP")
    const token = jwt.sign(
      { id: usuarioEncontrado._id, nombre: usuarioEncontrado.nombre },
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' }
    );

    res.status(200).json({ mensaje: "Login exitoso", token });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", detalle: error });
  }
};