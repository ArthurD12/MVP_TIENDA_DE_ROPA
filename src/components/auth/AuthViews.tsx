import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles } from 'lucide-react';

interface AuthContainerProps {
  onSuccess: () => void;
}

export function AuthContainer({ onSuccess }: AuthContainerProps) {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-foreground" />
            <h1 className="text-3xl font-light tracking-widest text-foreground">MUJER UNICA</h1>
          </div>
          <p className="text-sm text-primary-500 tracking-wide">MODA INTELIGENTE</p>
        </div>

        <div className="bg-white rounded-2xl shadow-elegant-lg p-8">
          {view === 'login' && <LoginView onSwitch={setView} onSuccess={onSuccess} />}
          {view === 'signup' && <SignupView onSwitch={setView} />}
          {view === 'forgot' && <ForgotPasswordView onSwitch={setView} />}
        </div>
      </div>
    </div>
  );
}

function LoginView({
  onSwitch,
  onSuccess,
}: {
  onSwitch: (v: 'login' | 'signup' | 'forgot') => void;
  onSuccess: () => void;
}) {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      showToast('Bienvenida a MUJER UNICA', 'success');
      onSuccess();
    } else {
      showToast('Credenciales incorrectas', 'error');
    }
  };

  return (
    <div className="animate-slide-up">
      <h2 className="text-xl font-semibold text-center mb-6">Iniciar Sesion</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-600">Correo Electronico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full pl-11 pr-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-600">Contrasena</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-primary-300 text-foreground focus:ring-foreground/20"
            />
            <span className="text-sm text-primary-500">Recordar mi cuenta</span>
          </label>
          <button
            type="button"
            onClick={() => onSwitch('forgot')}
            className="text-sm text-primary-500 hover:text-foreground transition-colors"
          >
            ¿Olvidaste tu contrasena?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando...' : 'Iniciar Sesion'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-primary-500">
          ¿No tienes cuenta?{' '}
          <button onClick={() => onSwitch('signup')} className="font-medium text-foreground hover:underline">
            Crear una cuenta
          </button>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-primary-200 text-center">
        <p className="text-xs text-primary-400 mb-2">Demo rapido</p>
        <button
          onClick={() => {
            setEmail('demo@mujerunica.com');
            setPassword('demo123');
          }}
          className="text-xs text-primary-500 hover:text-foreground underline transition-colors"
        >
          Usar credenciales demo
        </button>
      </div>
    </div>
  );
}

function SignupView({ onSwitch }: { onSwitch: (v: 'login' | 'signup' | 'forgot') => void }) {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Las contrasenas no coinciden', 'error');
      return;
    }
    if (!acceptTerms) {
      showToast('Debes aceptar los terminos de servicio', 'error');
      return;
    }

    setLoading(true);
    const success = await signup(name, email, password);
    setLoading(false);

    if (success) {
      showToast('Cuenta creada exitosamente', 'success');
      onSwitch('login');
    } else {
      showToast('El correo ya esta registrado', 'error');
    }
  };

  return (
    <div className="animate-slide-up">
      <h2 className="text-xl font-semibold text-center mb-6">Crear Cuenta</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-600">Nombre Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full pl-11 pr-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-600">Correo Electronico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full pl-11 pr-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-600">Contrasena</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-600">Confirmar Contrasena</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={e => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-primary-300 text-foreground focus:ring-foreground/20"
          />
          <span className="text-sm text-primary-500">
            Acepto los{' '}
            <span className="text-foreground underline">Terminos de Servicio</span> y{' '}
            <span className="text-foreground underline">Politicas de Privacidad</span>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-primary-500">
          ¿Ya tienes cuenta?{' '}
          <button onClick={() => onSwitch('login')} className="font-medium text-foreground hover:underline">
            Iniciar sesion
          </button>
        </p>
      </div>
    </div>
  );
}

function ForgotPasswordView({ onSwitch }: { onSwitch: (v: 'login' | 'signup' | 'forgot') => void }) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Por favor ingresa tu correo', 'error');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setSent(true);
    showToast('Enlace enviado', 'success');
  };

  if (sent) {
    return (
      <div className="animate-slide-up text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Enlace Enviado</h2>
        <p className="text-primary-500 mb-6">
          Revisa tu bandeja de entrada. Hemos enviado un enlace de recuperacion a {email}
        </p>
        <button
          onClick={() => onSwitch('login')}
          className="text-foreground font-medium hover:underline"
        >
          Volver al inicio de sesion
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <button onClick={() => onSwitch('login')} className="flex items-center gap-2 text-primary-500 hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Volver</span>
      </button>

      <h2 className="text-xl font-semibold text-center mb-2">Recuperar Contrasena</h2>
      <p className="text-sm text-primary-500 text-center mb-6">
        Introduce tu correo electronico para enviarte un enlace de recuperacion.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-600">Correo Electronico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full pl-11 pr-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enviando...' : 'Enviar Enlace'}
        </button>
      </form>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
