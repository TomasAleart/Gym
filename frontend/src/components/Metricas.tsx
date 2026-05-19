interface MetricasProps {
  totalSocios: number;
  activos: number;
  inactivos: number;
  porcentajeActivos: number;
}

export function Metricas({ totalSocios, activos, inactivos, porcentajeActivos }: MetricasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Total Socios */}
      <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500">
        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Total Socios</p>
        <div className="flex items-center justify-between mt-2">
          <h3 className="text-3xl font-bold text-gray-800">{totalSocios}</h3>
          <span className="p-2 bg-blue-50 text-blue-500 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Activos */}
      <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500">
        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Activos</p>
        <div className="flex items-center justify-between mt-2">
          <h3 className="text-3xl font-bold text-gray-800">{activos}</h3>
          <span className="p-2 bg-green-50 text-green-500 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Inactivos */}
      <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-500">
        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Inactivos</p>
        <div className="flex items-center justify-between mt-2">
          <h3 className="text-3xl font-bold text-gray-800">{inactivos}</h3>
          <span className="p-2 bg-red-50 text-red-500 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Porcentaje Actividad */}
      <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-purple-500">
        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">% Actividad</p>
        <div className="flex items-center justify-between mt-2">
          <h3 className="text-3xl font-bold text-gray-800">{porcentajeActivos}%</h3>
          <span className="p-2 bg-purple-50 text-purple-500 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}