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

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Validar que vengan los datos
    if (!email || !password) {
      res.status(400).json({ message: 'Email y contraseña son requeridos' });
      return;
    }

    // 2. Verificar si el usuario ya existe en la base de datos
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      return;
    }

    // 3. Crear el nuevo usuario
    // Nota: Si en tu modelo 'Usuario.ts' ya tenés un middleware .pre('save') con bcrypt, 
    // Mongoose le va a hacer el hash automáticamente al hacer el .save()
    const nuevoUsuario = new Usuario({ email, password });
    await nuevoUsuario.save();

    // 4. Generar el Token JWT para que se loguee automáticamente al registrarse
    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET || 'secretapordefecto',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario creado con éxito',
      token
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor al registrar usuario' });
  }
};