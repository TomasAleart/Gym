import React, { useState } from 'react';
import { authService } from '../services/api'; 

interface AuthProps {
  onLoginSuccess: (token: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      if (esRegistro) {
        // 🚀 LLAMADA REAL AL BACKEND PARA REGISTRAR
        // Pasamos un objeto con las propiedades que espera tu backend
        await authService.registrar({ email, password, nombre: "Admin" }); 
        
        alert('¡Cuenta de administrador creada con éxito! Ya podés iniciar sesión.');
        setEsRegistro(false); // Volvemos automáticamente a la pestaña de Login
        setPassword('');      // Limpiamos la contraseña por seguridad
      } else {
        // Lógica de login real que ya tenías
        const data = await authService.login({ email, password });
        const elToken = data.token;
        
        onLoginSuccess(elToken);
      }
    } catch (err: any) {
      // Atajamos el mensaje de error que viene desde tu res.status(400).json(...) del backend
      const mensajeError = err.response?.data?.mensaje || 'Ocurrió un error en la autenticación';
      setError(mensajeError);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {esRegistro ? 'GymApp Registro' : 'GymApp Login'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {esRegistro ? 'Crear Cuenta' : 'Entrar al Panel'}
          </button>
        </form>

        <div className="text-center mt-4 border-t border-gray-200 pt-4">
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
            onClick={() => {
              setEsRegistro(!esRegistro);
              setError('');
            }}
          >
            {esRegistro ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate acá'}
          </button>
        </div>
      </div>
    </div>
  );
};