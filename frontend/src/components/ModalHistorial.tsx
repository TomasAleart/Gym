import { useEffect, useState } from 'react';
import { formatearFecha } from '../utils/fechas';
import { pagoService } from '../services/api';

interface ModalHistorialProps {
  isOpen: boolean;
  onClose: () => void;
  socio: any;
  token: string;
}

export function ModalHistorial({ isOpen, onClose, socio, token }: ModalHistorialProps) {
  const [historial, setHistorial] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarHistorial = async () => {
      if (!isOpen || !socio?._id) return;
      setCargando(true);
      try {
        const data = await pagoService.getHistorial(socio._id, token);
        setHistorial(data);
      } catch (error) {
        alert("Error al cargar el historial de pagos");
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, [isOpen, socio?._id, token]);

  if (!isOpen || !socio) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Historial de Pagos</h3>
            <p className="text-xs text-gray-500 mt-0.5">Socio: {socio.nombre} {socio.apellido}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-1 my-2">
          {cargando ? (
            <p className="text-center py-8 text-gray-400 animate-pulse">Cargando pagos registrados...</p>
          ) : historial.length === 0 ? (
            <p className="text-center py-8 text-gray-400 italic">Este socio no registra pagos en el sistema.</p>
          ) : (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-3 pl-4">Mes Cubierto</th>
                    <th className="p-3">Monto</th>
                    <th className="p-3 pr-4">Fecha de Cobro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {historial.map((pago: any) => (
                    <tr key={pago._id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3 pl-4 font-semibold text-gray-900">{pago.mesReferencia}</td>
                      <td className="p-3 text-green-600 font-medium">${pago.monto}</td>
                      <td className="p-3 text-gray-400 pr-4">{formatearFecha(pago.fecha)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 text-right flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}