export const obtenerProximoMes = (fechaISO: string | null | undefined) => {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const hoy = new Date();

  if (!fechaISO || fechaISO.trim() === "" || isNaN(Date.parse(fechaISO))) {
    const nombreMes = meses[hoy.getMonth()];
    const anio = hoy.getFullYear();
    return {
      textoInput: `${nombreMes} ${anio}`,
      nuevaFechaSocio: `${anio}-${String(hoy.getMonth() + 1).padStart(2, '0')}-01`
    };
  }

  const fecha = new Date(fechaISO);
  fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());

  let mesIdx = fecha.getMonth();
  let anio = fecha.getFullYear();

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

export const formatearFecha = (fecha: string) => {
  if (!fecha) return "Sin datos";
  const dateObj = new Date(fecha);
  dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
  return dateObj.toLocaleDateString('es-AR');
};