import { useState, useEffect } from 'react';

interface FormularioSocioProps {
  editando: boolean;
  socioAEditar: any;
  onGuardar: (datos: any) => Promise<void>;
  onCancelar: () => void;
}

export function FormularioSocio({ editando, socioAEditar, onGuardar, onCancelar }: FormularioSocioProps) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [estado, setEstado] = useState('true');

  // Si cambiamos de socio a editar, repoblamos los inputs locales
  useEffect(() => {
    if (editando && socioAEditar) {
      setNombre(socioAEditar.nombre || '');
      setApellido(socioAEditar.apellido || '');
      setDni(socioAEditar.dni?.toString() || '');
      setEstado(socioAEditar.estaActivo ? 'true' : 'false');
    } else {
      limpiarFormulario();
    }
  }, [editando, socioAEditar]);

  const limpiarFormulario = () => {
    setNombre('');
    setApellido('');
    setDni('');
    setEstado('true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const datosSocio = {
      nombre,
      apellido,
      dni: Number(dni),
      estaActivo: estado === 'true'
    };

    await onGuardar(datosSocio);
    if (!editando) limpiarFormulario();
  };

  return (
    <section className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-700 mb-4">
        {editando ? '📝 Editando Socio' : '👤 Registrar Nuevo Socio'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre Completo</label>
          <input 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Ej: Julian" 
            required 
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Apellido</label>
          <input 
            value={apellido} 
            onChange={(e) => setApellido(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Ej: Alvarez" 
            required 
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">DNI</label>
          <input 
            value={dni} 
            onChange={(e) => setDni(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Solo números" 
            required 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estado</label>
          <select 
            value={estado} 
            onChange={(e) => setEstado(e.target.value)} 
            className="border border-gray-200 rounded-lg p-2 bg-white outline-none"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            className={`${editando ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-lg font-bold transition shadow-md`}
          >
            {editando ? 'Guardar Cambios' : '+ Agregar'}
          </button>
          {editando && (
            <button 
              type="button" 
              onClick={onCancelar} 
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}