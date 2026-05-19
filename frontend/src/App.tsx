import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [socios, setSocios] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoDni, setNuevoDni] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('true');
  const [nuevoApellido, setNuevoApellido] = useState(''); // Nuevo estado
  const [editando, setEditando] = useState(false);
  const [socioIdAEditar, setSocioIdAEditar] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [nuevaFechaPago, setNuevaFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [verHistorial, setVerHistorial] = useState(false);
  const [historialSocio, setHistorialSocio] = useState([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState<any>(null);
  const [verRegistrarPago, setVerRegistrarPago] = useState(false);
  const [pagoMonto, setPagoMonto] = useState('');
  const [pagoMes, setPagoMes] = useState('');

  const obtenerProximoMes = (fechaISO: string | null | undefined) => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const hoy = new Date();

    // Si no hay fecha previa ("Sin aportes"), el próximo mes a pagar es el mes actual real
    if (!fechaISO) {
      const nombreMes = meses[hoy.getMonth()];
      const anio = hoy.getFullYear();
      // Devolvemos el string para el input y la fecha correspondiente (el primero de este mes)
      return {
        textoInput: `${nombreMes} ${anio}`,
        nuevaFechaSocio: `${anio}-${String(hoy.getMonth() + 1).padStart(2, '0')}-01`
      };
    }

    // Si ya tiene una fecha, leemos su mes y año locales
    const fecha = new Date(fechaISO);
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());

    let mesIdx = fecha.getMonth();
    let anio = fecha.getFullYear();

    // Avanzamos al siguiente mes
    mesIdx++;
    if (mesIdx > 11) {
      mesIdx = 0;
      anio++;
    }

    const proximoMesNombre = meses[mesIdx];
    return {
      textoInput: `${proximoMesNombre} ${anio}`,
      nuevaFechaSocio: `${anio}-${String(mesIdx + 1).padStart(2, '0')}-01`
    };
  };

  const manejarRegistrarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socioSeleccionado) return;

    try {
      const datosPago = {
        socioId: socioSeleccionado._id,
        monto: Number(pagoMonto),
        mesReferencia: pagoMes // Ej: "Mayo 2026" (Para el historial de pagos)
      };

      // 1. Guardamos el recibo en el historial de pagos
      await axios.post('http://localhost:3000/api/pagos/registrar', datosPago);
      
      // 2. Actualizamos el socio usando el campo nativo de su base de datos
      const datosSocioActualizado = {
        ...socioSeleccionado,
        fechaUltimoPago: nuevaFechaPago // Clavamos el "2026-05-01" correspondiente
      };

      await axios.put(`http://localhost:3000/api/socios/editar/${socioSeleccionado._id}`, datosSocioActualizado, {
        headers: { 'auth-token': token }
      });
      
      alert(`Pago de ${pagoMes} registrado con éxito`);
      
      // 3. Limpiamos estados y cerramos
      setVerRegistrarPago(false);
      setPagoMonto('');
      setPagoMes('');
      
      // 4. Refrescamos la tabla principal
      traerSocios();
    } catch (error) {
      alert("Error al registrar el pago en el sistema");
    }
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "Sin datos";
    // Creamos el objeto fecha, pero usamos los métodos que obtienen el día/mes/año local del string sin desfasaje
    const dateObj = new Date(fecha);
    // Sumamos el desfasaje horario local para que no "vuelva" al día anterior
    dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
    return dateObj.toLocaleDateString('es-AR');
  };
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

  const abrirHistorial = async (socio: any) => {
    setSocioSeleccionado(socio);
    try {
      const res = await axios.get(`http://localhost:3000/api/pagos/historial/${socio._id}`);
      setHistorialSocio(res.data);
      setVerHistorial(true);
    } catch (error) {
      alert("Error al cargar el historial");
    }
  };

  // --- LÓGICA DE ALTA DE SOCIO ---
  const guardarSocio = async (e: React.FormEvent) => {
    e.preventDefault();
    const datosSocio = {
      nombre: nuevoNombre,
      apellido: nuevoApellido,
      dni: Number(nuevoDni),
      estaActivo: nuevoEstado === "true",
      fechaUltimoPago: editando? nuevaFechaPago : ""
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
    setNuevaFechaPago(new Date(socio.fechaUltimoPago).toISOString().split('T')[0]);
    
    // Opcional: Hacer scroll hacia arriba para que el usuario vea el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setSocioIdAEditar(null);
    setNuevoNombre('');
    setNuevoApellido('');
    setNuevoDni('');
    setNuevoEstado('true');
    setNuevaFechaPago(new Date().toISOString().split('T')[0]);
   };

  const sociosFiltrados = socios.filter((socio: any) => 
  socio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
  socio.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
  socio.dni.toString().includes(busqueda)
  );

  useEffect(() => {
    traerSocios();
  }, [token]);

  const totalSocios = socios.length;
  const activos = socios.filter((s: any) => s.estaActivo).length;
  const inactivos = totalSocios - activos;
  // Calculamos el porcentaje de ocupación/actividad
  const porcentajeActivos = totalSocios > 0 ? Math.round((activos / totalSocios) * 100) : 0;

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Card Total */}
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

        {/* Card Activos */}
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
          {/* Card Inactivos */}
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

          {/* Card % Actividad */}
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
                <th className="p-4 font-semibold text-gray-600 text-left">Último Pago</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Acciones</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-100">
                {sociosFiltrados.map((socio: any) => (
                  <tr key={socio._id} className="hover:bg-gray-50 transition">
                    {/* 1. Nombre y Apellido */}
                    <td className="p-4 text-gray-800 font-medium">
                      {socio.nombre} {socio.apellido}
                    </td>

                    {/* 2. DNI */}
                    <td className="p-4 text-gray-500">
                      {socio.dni}
                    </td>

                    {/* 3. Estado (Badge) */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        socio.estaActivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {socio.estaActivo ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>

                    {/* 4. ÚLTIMO PAGO (Con lógica de colores) */}
                    <td className="p-4 text-sm">
                      {(() => {
                        if (!socio.fechaUltimoPago) return <span className="text-red-500 font-bold">Sin aportes</span>;

                        const fecha = new Date(socio.fechaUltimoPago);
                        fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
                        
                        const opciones: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
                        const mesCubiertoStr = fecha.toLocaleDateString('es-AR', opciones);
                        const mesCubiertoFormateado = mesCubiertoStr.charAt(0).toUpperCase() + mesCubiertoStr.slice(1);

                        const hoy = new Date();
                        const anioActual = hoy.getFullYear();
                        const mesActual = hoy.getMonth();

                        const anioPago = fecha.getFullYear();
                        const mesPago = fecha.getMonth();

                        let colorClase = "text-green-600 font-semibold";

                        // Si el período pago es menor al mes/año actual, está vencido
                        if (anioPago < anioActual || (anioPago === anioActual && mesPago < mesActual)) {
                          colorClase = "text-red-600 font-bold";
                        }

                        return (
                          <span className={colorClase}>
                            {mesCubiertoFormateado}
                          </span>
                        );
                      })()}
                    </td>              

                    {/* 5. Acciones */}
                    <td className="p-4 text-center">
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
                          onClick={() => { 
                              setSocioSeleccionado(socio); 
                              // Calculamos el próximo mes en base a la fecha real que viene de Mongo
                              const resultado = obtenerProximoMes(socio.fechaUltimoPago);
                              
                              setPagoMes(resultado.textoInput);       // Para mostrar en el input bloqueado (ej: "Mayo 2026")
                              setNuevaFechaPago(resultado.nuevaFechaSocio); // Guardamos la fecha equivalente (ej: "2026-05-01")
                              setVerRegistrarPago(true); 
                            }}
                            className="text-green-500 hover:text-green-700 transition-colors p-1"
                            title="Registrar Nuevo Pago"
                          >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => abrirHistorial(socio)}
                          className="text-purple-500 hover:text-purple-700 p-1"
                          title="Ver Historial de Pagos"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      {/* MODAL PARA REGISTRAR PAGO NUEVO */}
     {verRegistrarPago && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Registrar Pago para {socioSeleccionado?.nombre}
              </h3>
              <button onClick={() => setVerRegistrarPago(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
            </div>

            <form onSubmit={manejarRegistrarPago} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Mes de Referencia</label>
                <input 
                  type="text" 
                  value={pagoMes} 
                  disabled // <-- ¡ESTO BLOQUEA EL INPUT! Evita errores humanos y saltos de meses
                  className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-lg p-2 outline-none cursor-not-allowed"
                  required 
                />
                <p className="text-xs text-gray-400 mt-1">El sistema calcula correlativamente la cuota que corresponde abonar.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Monto ($)</label>
                <input 
                  type="number" 
                  placeholder="Ej: 12000" 
                  value={pagoMonto} 
                  onChange={(e) => setPagoMonto(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-green-500"
                  required 
                />
              </div>

              <div className="border-t pt-3 mt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setVerRegistrarPago(false)} 
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
                >
                  Confirmar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{/* MODAL DEL HISTORIAL DE PAGOS */}
      {verHistorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative max-h-[80vh] flex flex-col">
            
            {/* Cabecera del Modal */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Historial de {socioSeleccionado?.nombre} {socioSeleccionado?.apellido}
              </h3>
              <button 
                onClick={() => setVerHistorial(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl p-1"
              >
                ✕
              </button>
            </div>

            {/* Contenido / Tabla interna */}
            <div className="overflow-y-auto flex-1">
              {historialSocio.length === 0 ? (
                <p className="text-center text-gray-500 my-8">Este socio no registra pagos en el sistema.</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm font-semibold">
                      <th className="pb-2">Mes</th>
                      <th className="pb-2">Fecha</th>
                      <th className="pb-2 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historialSocio.map((pago: any) => (
                      <tr key={pago._id} className="text-sm text-gray-700">
                        <td className="py-3 font-medium">{pago.mesReferencia || "Mensualidad"}</td>
                        <td className="py-3">{formatearFecha(pago.fecha)}</td>
                        <td className="py-3 text-right text-green-600 font-semibold">
                          ${pago.monto.toLocaleString('es-AR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Botón de Cierre */}
            <div className="border-t pt-3 mt-4 text-right">
              <button 
                onClick={() => setVerHistorial(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;