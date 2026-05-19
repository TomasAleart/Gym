import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
  socioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Socio', // Esto conecta con tu modelo de Socio
    required: true 
  },
  fecha: { type: Date, default: Date.now },
  monto: { type: Number, required: true },
  mesReferencia: { type: String } // Ejemplo: "Mayo 2026"
});

const Pago = mongoose.model('Pago', pagoSchema);
export default Pago;