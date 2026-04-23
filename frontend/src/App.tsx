import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [socios, setSocios] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Pedimos el token al backend
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      const elToken = res.data.token;
      
      // 2. Lo guardamos en el estado y en la memoria del navegador
      setToken(elToken);
      localStorage.setItem('token', elToken);
      alert("Login exitoso!");
    } catch (err) {
      alert("Error en el login. Revisá tus credenciales.");
    }
  }

  useEffect(() => {
    if (token) {
      const traerSocios = async () => {
        try {
          // 3. Enviamos el token en los encabezados (Headers)
          const res = await axios.get('http://localhost:3000/api/socios/todos', {
            headers: { 'auth-token': token }
          });
          setSocios(res.data);
        } catch (err) {
          console.error("Error al traer socios", err);
        }
      };
      traerSocios();
    }
  }, [token]); // Se ejecuta cada vez que el token cambia

  // Si no hay token, mostramos el Login
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">GymApp Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input 
                type="password" 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Si hay token, mostramos la lista (tu código anterior)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de Navegación */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
        <h1 className="text-xl font-bold text-blue-600">GymApp <span className="text-gray-400 text-sm font-normal">| Panel de Socios</span></h1>
        <button 
          onClick={() => { localStorage.removeItem('token'); setToken(''); }}
          className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
        >
          Cerrar Sesión
        </button>
      </nav>

      <main className="p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-bottom border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Socio</th>
                <th className="p-4 font-semibold text-gray-600">DNI</th>
                <th className="p-4 font-semibold text-gray-600">Estado de Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {socios.map((socio: any) => (
                <tr key={socio._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-800 font-medium">{socio.nombre}</td>
                  <td className="p-4 text-gray-500">{socio.dni}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      socio.estadoPago === 'pagado' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                    }`}>
                      {socio.estadoPago.toUpperCase()}
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