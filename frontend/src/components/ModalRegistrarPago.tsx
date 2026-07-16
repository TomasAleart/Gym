import React, { useState } from 'react';
import { pagoService, socioService } from '../services/api';

interface ModalRegistrarPagoProps {
  isOpen: boolean;
  onClose: () => void;
  socio: any;
  pagoMes: string;
  nuevaFechaPago: string;
  token: string;
  onPagoRegistrado: () => void; // Avisa a App.tsx para recargar la tabla
}

export function ModalRegistrarPago({
  isOpen,
  onClose,
  socio,
  pagoMes,
  nuevaFechaPago,
  token,
  onPagoRegistrado
}: ModalRegistrarPagoProps) {
  const [monto, setMonto] = useState('');

  if (!isOpen || !socio) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const datosPago = {
        socioId: socio._id,
        monto: Number(monto),
        mesReferencia: pagoMes
      };

      // 1. Registra el pago en la API
      await pagoService.registrar(datosPago, token);
      
      // 2. Modifica el estado de la fecha del último pago del socio
      const datosSocioActualizado = {
        ...socio,
        fechaUltimoPago: nuevaFechaPago
      };
      await socioService.editar(socio._id, datosSocioActualizado, token);
      
      alert(`Pago de ${pagoMes} registrado con éxito`);
      setMonto(''); // Limpiamos el formulario local
      onPagoRegistrado(); // Le avisa al orquestador que refresque los datos
      onClose(); // Se cierra de manera autónoma
    } catch (error) {
      alert("Error al registrar el pago en el sistema");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Registrar Pago</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Socio: <span className="font-semibold text-gray-900">{socio.nombre} {socio.apellido}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Período a Cubrir</label>
            <input
              type="text"
              value={pagoMes}
              disabled
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-500 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Monto del Aporte ($)</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ej: 4500"
              required
              className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition shadow-md"
            >
              Confirmar Pago
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}