import { useState, useEffect } from 'react'
import axios from 'axios'

// Definimos qué forma tiene un Socio para que TypeScript no se queje
interface Socio {
  _id: string;
  nombre: string;
  dni: string;
  estadoPago: string;
}

function App() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [cargando, setCargando] = useState(true);

  // useEffect se ejecuta apenas se abre la página
  useEffect(() => {
    const traerSocios = async () => {
      try {
        // Hacemos el pedido al servidor del BACKEND (Puerto 3000)
        const respuesta = await axios.get('http://localhost:3000/api/socios/todos');
        setSocios(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error("Error al traer socios:", error);
        setCargando(false);
      }
    };

    traerSocios();
  }, []); // El array vacío [] significa: "hacelo solo una vez al cargar"

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>GymApp - Panel de Control</h1>
      <p>Estado del sistema: <b>{cargando ? 'Cargando...' : 'Conectado'}</b></p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Lista de Socios</h2>
        {socios.length === 0 && !cargando ? (
          <p>No hay socios cargados en la base de datos.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {socios.map(socio => (
              <li key={socio._id} style={{ 
                padding: '10px', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{socio.nombre} (DNI: {socio.dni})</span>
                <span style={{ 
                  color: socio.estadoPago === 'pagado' ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {socio.estadoPago.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App