import { useState, useEffect } from 'react';
import { obtenerProximoMes} from './utils/fechas';
import { socioService} from './services/api';
import { Auth } from './components/Auth';
import { Metricas } from './components/Metricas';
import { Navbar } from './components/Navbar';
import { FormularioSocio } from './components/FormularioSocio';
import { TablaSocios } from './components/TablaSocios';
import { ModalRegistrarPago } from './components/ModalRegistrarPago';
import { ModalHistorial } from './components/ModalHistorial';

function App() {
  const [socios, setSocios] = useState<any[]>([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [editando, setEditando] = useState(false);
  const [socioIdAEditar, setSocioIdAEditar] = useState<string | null>(null);
  const [nuevaFechaPago, setNuevaFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [verHistorial, setVerHistorial] = useState(false);
  const [socioSeleccionado, setSocioSeleccionado] = useState<any>(null);
  const [verRegistrarPago, setVerRegistrarPago] = useState(false);
  const [pagoMes, setPagoMes] = useState('');
  const [socioAEditarObjeto, setSocioAEditarObjeto] = useState<any>(null);

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
  const porcentajeActivos = totalSocios > 0 ? Math.round((activos / totalSocios) * 100) : 0;

  // VISTA 1: LOGIN
  if (!token) {
    return (
      <Auth 
        onLoginSuccess={(elToken) => {
          setToken(elToken);
          localStorage.setItem('token', elToken);
        }} 
      />
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
          onVerHistorial={(socio) => { setSocioSeleccionado(socio); setVerHistorial(true); }}
        />
      </main>
        {/* MODAL: REGISTRAR PAGO */}
        <ModalRegistrarPago 
          isOpen={verRegistrarPago}
          onClose={() => setVerRegistrarPago(false)}
          socio={socioSeleccionado}
          pagoMes={pagoMes}
          nuevaFechaPago={nuevaFechaPago}
          token={token}
          onPagoRegistrado={traerSocios}
        />

        {/* MODAL: HISTORIAL DE PAGOS */}
        <ModalHistorial 
          isOpen={verHistorial}
          onClose={() => setVerHistorial(false)}
          socio={socioSeleccionado}
          token={token}
        />
    </div>
  );
}

export default App;