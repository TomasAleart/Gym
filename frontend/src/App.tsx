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
  const agregarSocio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/socios/registrar', { 
        nombre: nuevoNombre,
        apellido: nuevoApellido,
        dni: Number(nuevoDni),
        // Convertimos el string "true"/"false" a un Booleano real
        estaActivo: nuevoEstado === "true" 
      }, {
        headers: { 'auth-token': token }
      });
      
      setNuevoNombre('');
      setNuevoApellido(''); // Limpiamos
      setNuevoDni('');
      traerSocios(); 
      alert("Socio agregado con éxito");
    } catch (err: any) {
      console.log(err.response?.data);
      alert("Error: " + (err.response?.data?.mensaje || "Error desconocido"));
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
          <h2 className="text-lg font-bold text-gray-700 mb-4">Registrar Nuevo Socio</h2>
          <form onSubmit={agregarSocio} className="flex flex-wrap gap-4 items-end">
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
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
              + Agregar
            </button>
          </form>
        </section>

        {/* TABLA DE SOCIOS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Socio</th>
                <th className="p-4 font-semibold text-gray-600">DNI</th>
                <th className="p-4 font-semibold text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {socios.map((socio: any) => (
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