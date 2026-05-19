import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Centralizamos las cabeceras de configuración para no repetir código
const getHeaders = (token: string) => ({
  headers: { 'auth-token': token }
});

export const authService = {
  login: async (credentials: any) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return res.data;
  }
};

export const socioService = {
  getAll: async (token: string) => {
    const res = await axios.get(`${API_BASE_URL}/socios/todos`, getHeaders(token));
    return res.data;
  },
  registrar: async (datos: any, token: string) => {
    const res = await axios.post(`${API_BASE_URL}/socios/registrar`, datos, getHeaders(token));
    return res.data;
  },
  editar: async (id: string, datos: any, token: string) => {
    const res = await axios.put(`${API_BASE_URL}/socios/editar/${id}`, datos, getHeaders(token));
    return res.data;
  },
  eliminar: async (id: string, token: string) => {
    const res = await axios.delete(`${API_BASE_URL}/socios/eliminar/${id}`, getHeaders(token));
    return res.data;
  }
};

export const pagoService = {
  registrar: async (datos: any, token: string) => {
    const res = await axios.post(`${API_BASE_URL}/pagos/registrar`, datos, getHeaders(token));
    return res.data;
  },
  getHistorial: async (socioId: string, token: string) => {
    const res = await axios.get(`${API_BASE_URL}/pagos/historial/${socioId}`, getHeaders(token));
    return res.data;
  }
};