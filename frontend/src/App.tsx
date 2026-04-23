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
      <div style={{ padding: '50px' }}>
        <h2>Login - GymApp</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  // Si hay token, mostramos la lista (tu código anterior)
  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel del Gimnasio</h1>
      <button onClick={() => { localStorage.removeItem('token'); setToken(''); }}>Cerrar Sesión</button>
      <ul>
        {socios.map((s: any) => <li key={s._id}>{s.nombre} - {s.estadoPago}</li>)}
      </ul>
    </div>
  );
}

export default App;