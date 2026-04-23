import { Schema, model } from 'mongoose';

// Definimos el "molde"
const socioSchema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: Number, required: true, unique: true },
    fechaIngreso: { type: Date, default: Date.now },
    estaActivo: { type: Boolean, default: true }
});

// Creamos el modelo basado en ese molde
// 'Socio' será el nombre de la colección en MongoDB
export const Socio = model('Socio', socioSchema);