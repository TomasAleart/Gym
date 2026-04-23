import { Schema, model } from 'mongoose';

const usuarioSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true }
});

export const Usuario = model('Usuario', usuarioSchema);