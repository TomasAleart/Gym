import { useState } from 'react';
import { formatearFecha } from '../utils/fechas';

interface TablaSociosProps {
  socios: any[];
  onEditar: (socio: any) => void;
  onBorrar: (id: string) => Promise<void>;
  onPagar: (socio: any) => void;
  onVerHistorial: (socio: any) => Promise<void>;
}

export function TablaSocios({ socios, onEditar, onBorrar, onPagar, onVerHistorial }: TablaSociosProps) {
  const [busqueda, setBusqueda] = useState('');

  // El filtrado seguro que armamos antes se ejecuta localmente acá
  const sociosFiltrados = socios.filter((socio: any) => 
    socio.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    socio.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
    socio.dni?.toString().includes(busqueda)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Barra de Búsqueda */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 className="font-bold text-gray-700 text-lg">Nómina de Socios</h3>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100/70 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
              <th className="p-4 pl-6">Socio</th>
              <th className="p-4">DNI</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Último Aporte</th>
              <th className="p-4 text-center pr-6">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {sociosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                  No se encontraron socios registrados o coincidentes.
                </td>
              </tr>
            ) : (
              sociosFiltrados.map((socio: any) => (
                <tr key={socio._id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 pl-6 font-semibold text-gray-900">
                    {socio.nombre} {socio.apellido}
                  </td>
                  <td className="p-4 text-gray-500">{socio.dni}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      socio.estaActivo 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {socio.estaActivo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {socio.fechaUltimoPago ? (
                      <span className="font-medium text-gray-700">{formatearFecha(socio.fechaUltimoPago)}</span>
                    ) : (
                      <span className="text-gray-400 italic">Sin aportes</span>
                    )}
                  </td>
                  <td className="p-4 text-center pr-6 flex justify-center gap-2">
                    <button
                      onClick={() => onPagar(socio)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
                    >
                      Pagar Cuota
                    </button>
                    <button
                      onClick={() => onVerHistorial(socio)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1.5 rounded-lg text-xs transition"
                    >
                      Historial
                    </button>
                    <button
                      onClick={() => onEditar(socio)}
                      className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition"
                      title="Editar Socio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onBorrar(socio._id)}
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar Socio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}