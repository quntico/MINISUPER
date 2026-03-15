
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/modules/core/contexts/AuthContext.jsx';
import { Store, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(error.message || 'Credenciales inválidas. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center w-full px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/20 transform -rotate-3 mb-4">
            <Store className="h-8 w-8 text-white transform rotate-3" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">MINISUPER POS</h2>
          <p className="text-sm text-gray-500 mt-2">Ingresa a tu cuenta para continuar</p>
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{formError}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="admin@ejemplo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
