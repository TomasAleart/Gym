import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [socios, setSocios] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoDni, setNuevoDni] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('pagado');
  const [nuevoApellido, setNuevoApellido] = useState(''); // Nuevo estado
  const [editando, setEditando] = useState(false);
  const [socioIdAEditar, setSocioIdAEditar] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // --- LÓGICA DE LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      const elToken = res.data.token;
      setToken(elToken);
      localStorage.setItem('token', elToken);
      alert("Login exitoso!");
    } catch (err) {
      alert("Error en el login. Revisá tus credenciales.");
    }
  }

  // --- LÓGICA DE ALTA DE SOCIO ---
  const guardarSocio = async (e: React.FormEvent) => {
    e.preventDefault();
    const datosSocio = {
      nombre: nuevoNombre,
      apellido: nuevoApellido,
      dni: Number(nuevoDni),
      estaActivo: nuevoEstado === "true"
    };

    try {
      if (editando && socioIdAEditar) {
        // MODO EDICIÓN: Usamos PUT
        await axios.put(`http://localhost:3000/api/socios/editar/${socioIdAEditar}`, datosSocio, {
          headers: { 'auth-token': token }
        });
        alert("Socio actualizado");
      } else {
        // MODO CREACIÓN: Usamos POST
        await axios.post('http://localhost:3000/api/socios/registrar', datosSocio, {
          headers: { 'auth-token': token }
        });
        alert("Socio registrado");
      }
      
      cancelarEdicion(); // Limpia todo
      traerSocios();
    } catch (err) {
      alert("Error al guardar");
    }
  };

  const borrarSocio = async (id: string) => {
    // Siempre pedí confirmación antes de una acción destructiva
    if (!window.confirm("¿Estás seguro de que querés eliminar a este socio?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/socios/eliminar/${id}`, {
        headers: { 'auth-token': token }
      });
      
      // Refrescamos la lista para que el socio "desaparezca" visualmente
      traerSocios();
    } catch (err) {
      alert("Error al intentar borrar el socio. Verificá la ruta en el backend.");
    }
  };

  // --- FUNCIÓN PARA TRAER SOCIOS (Reutilizable) ---
  const traerSocios = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:3000/api/socios/todos', {
        headers: { 'auth-token': token }
      });
      setSocios(res.data);
    } catch (err) {
      console.error("Error al traer socios", err);
    }
  };

  const prepararEdicion = (socio: any) => {
    setEditando(true);
    setSocioIdAEditar(socio._id);
    setNuevoNombre(socio.nombre);
    setNuevoApellido(socio.apellido);
    setNuevoDni(socio.dni.toString());
    setNuevoEstado(socio.estaActivo ? "true" : "false");
    
    // Opcional: Hacer scroll hacia arriba para que el usuario vea el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setSocioIdAEditar(null);
    setNuevoNombre('');
    setNuevoApellido('');
    setNuevoDni('');
    setNuevoEstado('pagado');
  };

  const sociosFiltrados = socios.filter((socio: any) => 
  socio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
  socio.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
  socio.dni.toString().includes(busqueda)
  );

  useEffect(() => {
    traerSocios();
  }, [token]);

  // VISTA 1: LOGIN
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">GymApp Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input type="password" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // VISTA 2: PANEL PRINCIPAL
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
        <h1 className="text-xl font-bold text-blue-600">GymApp <span className="text-gray-400 text-sm font-normal">| Panel de Socios</span></h1>
        <button onClick={() => { localStorage.removeItem('token'); setToken(''); }} className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100">
          Cerrar Sesión
        </button>
      </nav>

      <main className="p-8 max-w-5xl mx-auto">
        {/* AQUÍ AGREGAMOS EL FORMULARIO DE ALTA */}
        <section className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-700 mb-4">{editando ? '📝 Editando Socio' : '👤 Registrar Nuevo Socio'}</h2>
          <form onSubmit={guardarSocio} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre Completo</label>
              <input value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Julian " required />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Apellido</label>
              <input 
                value={nuevoApellido} 
                onChange={(e) => setNuevoApellido(e.target.value)} 
                className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ej: Alvarez" 
                required 
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">DNI</label>
              <input value={nuevoDni} onChange={(e) => setNuevoDni(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Solo números" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estado</label>
              <select 
                value={nuevoEstado} 
                onChange={(e) => setNuevoEstado(e.target.value)} 
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

              {/* Este botón solo aparece si editando es true */}
              {editando && (
                <button 
                  type="button"
                  onClick={cancelarEdicion}
                  className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        {/* TABLA DE SOCIOS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600 ">Socio</th>
                <th className="p-4 font-semibold text-gray-600 ">DNI</th>
                <th className="p-4 font-semibold text-gray-600 ">Estado</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sociosFiltrados.map((socio: any) => (
                <tr key={socio._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-800 font-medium">{socio.nombre} {socio.apellido}</td>
                  <td className="p-4 text-gray-500">{socio.dni}</td>
                  <td className="p-4">
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      socio.estaActivo 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                    }`}>
                      {socio.estaActivo ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </td>
                    <td className="p-4 text-center"> {/* Agregamos text-center aquí también por seguridad */}
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => prepararEdicion(socio)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        <button 
                          onClick={() => borrarSocio(socio._id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;