import { useState, useEffect } from 'react';
import { obtenerProximoMes} from './utils/fechas';
import { authService, socioService, pagoService } from './services/api';
import { Metricas } from './components/Metricas';
import { Navbar } from './components/Navbar';
import { FormularioSocio } from './components/FormularioSocio';
import { TablaSocios } from './components/TablaSocios';
import { ModalRegistrarPago } from './components/ModalRegistrarPago';
import { ModalHistorial } from './components/ModalHistorial';

function App() {
  const [socios, setSocios] = useState<any[]>([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editando, setEditando] = useState(false);
  const [socioIdAEditar, setSocioIdAEditar] = useState<string | null>(null);
  const [nuevaFechaPago, setNuevaFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [verHistorial, setVerHistorial] = useState(false);
  const [historialSocio, setHistorialSocio] = useState([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState<any>(null);
  const [verRegistrarPago, setVerRegistrarPago] = useState(false);
  const [pagoMonto, setPagoMonto] = useState('');
  const [pagoMes, setPagoMes] = useState('');
  const [socioAEditarObjeto, setSocioAEditarObjeto] = useState<any>(null);

  const manejarRegistrarPago = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!socioSeleccionado) return;

      try {
        const datosPago = {
          socioId: socioSeleccionado._id,
          monto: Number(pagoMonto),
          mesReferencia: pagoMes
        };

        // Uso del servicio de pago centralizado
        await pagoService.registrar(datosPago, token);
        
        const datosSocioActualizado = {
          ...socioSeleccionado,
          fechaUltimoPago: nuevaFechaPago
        };

        // Uso del servicio de socio centralizado
        await socioService.editar(socioSeleccionado._id, datosSocioActualizado, token);
        
        alert(`Pago de ${pagoMes} registrado con éxito`);
        setVerRegistrarPago(false);
        setPagoMonto('');
        setPagoMes('');
        traerSocios();
      } catch (error) {
        alert("Error al registrar el pago en el sistema");
      }
    };

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const data = await authService.login({ email, password });
        const elToken = data.token;
        setToken(elToken);
        localStorage.setItem('token', elToken);
        alert("Login exitoso!");
      } catch (err) {
        alert("Error en el login. Revisá tus credenciales.");
      }
    };

    const abrirHistorial = async (socio: any) => {
      setSocioSeleccionado(socio);
      try {
        const data = await pagoService.getHistorial(socio._id, token);
        setHistorialSocio(data);
        setVerHistorial(true);
      } catch (error) {
        alert("Error al cargar el historial");
      }
    };

    const guardarSocio = async (datosSocioDeFormulario: any) => {
      const fechaUltimoSocioValida = editando && socioIdAEditar
        ? (socios.find((s: any) => s._id === socioIdAEditar)?.fechaUltimoPago || "")
        : "";

      const datosCompletos = {
        ...datosSocioDeFormulario,
        fechaUltimoPago: editando ? fechaUltimoSocioValida : ""
      };

      try {
        if (editando && socioIdAEditar) {
          await socioService.editar(socioIdAEditar, datosCompletos, token);
          alert("Socio actualizado");
        } else {
          await socioService.registrar(datosCompletos, token);
          alert("Socio registrado");
        }
        cancelarEdicion();
        traerSocios();
      } catch (err) {
        alert("Error al guardar");
      }
    };

    const borrarSocio = async (id: string) => {
      if (!window.confirm("¿Estás seguro de que querés eliminar a este socio?")) return;
      try {
        await socioService.eliminar(id, token);
        traerSocios();
      } catch (err) {
        alert("Error al intentar borrar el socio.");
      }
    };

    const traerSocios = async () => {
      if (!token) return;
      try {
        const data = await socioService.getAll(token);
        setSocios(data);
      } catch (err) {
        console.error("Error al traer socios", err);
      }
    };

  const prepararEdicion = (socio: any) => {
    setEditando(true);
    setSocioIdAEditar(socio._id);
    setSocioAEditarObjeto(socio); // Guardamos el objeto completo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setSocioIdAEditar(null);
    setSocioAEditarObjeto(null);
  };

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
      <Navbar onLogout={() => { localStorage.removeItem('token'); setToken(''); }} />

      <main className="p-8 max-w-5xl mx-auto">
        {/* AQUÍ AGREGAMOS EL FORMULARIO DE ALTA */}
        <FormularioSocio 
          editando={editando}
          socioAEditar={socioAEditarObjeto}
          onGuardar={guardarSocio}
          onCancelar={cancelarEdicion}
        />
        <Metricas 
          totalSocios={totalSocios} 
          activos={activos} 
          inactivos={inactivos} 
          porcentajeActivos={porcentajeActivos} 
        />
        <TablaSocios 
          socios={socios}
          onEditar={prepararEdicion}
          onBorrar={borrarSocio}
          onPagar={(socio) => {
            setSocioSeleccionado(socio);
            const resultado = obtenerProximoMes(socio.fechaUltimoPago);
            setPagoMes(resultado.textoInput);
            setNuevaFechaPago(resultado.nuevaFechaSocio);
            setVerRegistrarPago(true);
          }}
          onVerHistorial={abrirHistorial}
        />
      </main>
      {/* MODAL: REGISTRAR PAGO */}
      <ModalRegistrarPago 
        isOpen={verRegistrarPago}
        onClose={() => setVerRegistrarPago(false)}
        socio={socioSeleccionado}
        pagoMonto={pagoMonto}
        setPagoMonto={setPagoMonto}
        pagoMes={pagoMes}
        onRegistrar={manejarRegistrarPago}
      />

      {/* MODAL: HISTORIAL DE PAGOS */}
      <ModalHistorial 
        isOpen={verHistorial}
        onClose={() => setVerHistorial(false)}
        socio={socioSeleccionado}
        historial={historialSocio}
      />
    </div>
  );
}

export default App;