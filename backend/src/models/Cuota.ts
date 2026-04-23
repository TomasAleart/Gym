import { Schema, model, Types } from 'mongoose';

const cuotaSchema = new Schema({
    // Aquí está la magia: vinculamos esta cuota con un ID de Socio
    socio: { type: Schema.Types.ObjectId, ref: 'Socio', required: true },
    mes: { type: String, required: true }, // Ej: "Mayo 2026"
    monto: { type: Number, required: true },
    pagado: { type: Boolean, default: false },
    fechaPago: { type: Date }
});

export const Cuota = model('Cuota', cuotaSchema);