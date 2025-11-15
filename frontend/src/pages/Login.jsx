import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';
import miLogo from '../assets/claro.ss.jpeg';
import fondo from '../assets/fondo.jpg';

export const Login = () => {
  const [credentials, setCredentials] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(credentials);

    if (result.success) {
      if (result.user.rol === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/practicante/perfil');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background image + overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${fondo})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header logo + title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-red-600">
            <img src={miLogo} alt="Logo Claro" className="w-14 h-14 rounded-full" />
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-white">Plataforma Digital Claro</h1>
          <p className="text-sm text-white/80">Claro - Peru</p>
        </div>

        {/* Card: white with red border */}
        <div className="bg-white/95 border-2 border-red-600 rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario input with emoji icon */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <span className="absolute left-3 top-11 transform -translate-y-1/2 text-xl pointer-events-none">👤</span>
              <input
                type="text"
                value={credentials.usuario}
                onChange={(e) => setCredentials({ ...credentials, usuario: e.target.value })}
                className="input input-bordered w-full pl-10 pr-3 focus:ring-2 focus:ring-red-400 focus:outline-none"
                placeholder="Ingresa tu usuario"
                required
                autoFocus
              />
            </div>

            {/* Contraseña input with emoji icon */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <span className="absolute left-3 top-11 transform -translate-y-1/2 text-xl pointer-events-none">🔒</span>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="input input-bordered w-full pl-10 pr-3 focus:ring-2 focus:ring-red-400 focus:outline-none"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>¿Problemas para entrar? Contacta soporte.</p>
          </div>
        </div>
      </div>
    </div>
  );
};