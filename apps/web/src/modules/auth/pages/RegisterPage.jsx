
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/modules/core/contexts/AuthContext.jsx';
import { Store, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de correo inválido';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Debe tener al menos 8 caracteres';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (globalError) setGlobalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await register({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
        name: formData.name,
      });
      
      setSuccessMessage('¡Cuenta creada con éxito! Preparando tu entorno...');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
      
    } catch (error) {
      // Handle specific errors returned from AuthContext
      if (error.message.includes('ya está registrado')) {
        setErrors(prev => ({ ...prev, email: error.message }));
      } else {
        setGlobalError(error.message || 'Error al registrar la cuenta. Por favor, intenta de nuevo.');
      }
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-100/50 text-center">
          <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
          <p className="text-gray-600 mb-8">{successMessage}</p>
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-100/50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/20 transform -rotate-3">
            <Store className="h-8 w-8 text-white transform rotate-3" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Comienza a gestionar tu negocio hoy
          </p>
        </div>

        {globalError && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{globalError}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={cn(
                "appearance-none block w-full px-4 py-3 border placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm",
                errors.name 
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                  : "border-gray-200 focus:ring-green-500/20 focus:border-green-500"
              )}
              placeholder="Ej. Juan Pérez"
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={cn(
                "appearance-none block w-full px-4 py-3 border placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm",
                errors.email 
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                  : "border-gray-200 focus:ring-green-500/20 focus:border-green-500"
              )}
              placeholder="admin@ejemplo.com"
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className={cn(
                "appearance-none block w-full px-4 py-3 border placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm",
                errors.password 
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                  : "border-gray-200 focus:ring-green-500/20 focus:border-green-500"
              )}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              className={cn(
                "appearance-none block w-full px-4 py-3 border placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm",
                errors.confirmPassword 
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                  : "border-gray-200 focus:ring-green-500/20 focus:border-green-500"
              )}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] shadow-md shadow-green-600/20"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                'Registrarse'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
