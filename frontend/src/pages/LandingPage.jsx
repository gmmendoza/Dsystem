import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { 
  ArrowRight, BookOpen, Calendar, Bell, ShieldCheck, 
  GraduationCap, Lock, User, Loader2, ChevronDown, 
  Eye, EyeOff, CheckCircle, Zap, Globe, Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginRef = useRef(null);
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Form handling with React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      username: 'admin',
      password: 'admin'
    }
  });

  const onLoginSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const response = await authAPI.login(data);
      login(response.data.token, { 
        username: response.data.username, 
        rol: response.data.rol 
      });
      navigate('/app/dashboard');
    } catch (err) {
      setServerError(err.message || 'Credenciales incorrectas. Intente con admin/admin.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 selection:bg-primary-500/30">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
        
        <div className="max-w-5xl mx-auto text-center z-10 space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary-400 text-sm font-semibold animate-bounce-slow">
            <Sparkles size={16} className="text-yellow-400" />
            <span>Nueva Versión v2.1 disponible</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
            Sistema <span className="text-primary-500">DSystem</span>
            <br />
            <span className="text-white/20 hover:text-white transition-colors duration-700 cursor-default">
              Gestión Docente
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-gray-400 font-medium leading-relaxed">
            La herramienta definitiva para el docente moderno. Organiza el caos, 
            automatiza tus reportes y toma el control total de tu aula con elegancia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <button 
              onClick={scrollToLogin}
              className="group relative px-10 py-5 bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest rounded-none transform hover:-translate-y-1 transition-all shadow-[8px_8px_0px_0px_rgba(37,99,235,0.3)] hover:shadow-none"
            >
              Comenzar Ahora
            </button>
            <button className="px-10 py-5 bg-transparent text-white font-bold uppercase tracking-widest border-2 border-white/10 hover:border-white/40 transition-all">
              Explorar
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer" onClick={scrollToLogin}>
          <span className="text-xs font-bold uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown className="animate-bounce" />
        </div>
      </section>

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-32 px-4 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <ValueCard 
            icon={<Zap className="text-primary-400" />}
            title="Velocidad Pura"
            desc="Carga instantánea de datos y navegación fluida tipo SPA."
          />
          <ValueCard 
            icon={<Globe className="text-blue-400" />}
            title="Acceso Global"
            desc="Tus planificaciones disponibles desde cualquier dispositivo, siempre."
          />
          <ValueCard 
            icon={<CheckCircle className="text-green-400" />}
            title="Validación Real"
            desc="Evita errores en fechas y formularios con nuestro motor inteligente."
          />
        </div>
      </section>

      {/* --- FEATURE HIGHLIGHT --- */}
      <section className="py-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight italic">
              Todo bajo <br /><span className="text-primary-600">tú control</span>
            </h2>
            <div className="space-y-6">
              <FeatureItem title="Agenda Dinámica" text="CalendarioFullCalendar de alto rendimiento." />
              <FeatureItem title="Planificador Pro" text="Editor con validación de formularios en tiempo real." />
              <FeatureItem title="Notificaciones" text="Avisos mediante WebSockets para eventos críticos." />
            </div>
          </div>
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-primary-600/30 blur-[100px] group-hover:bg-primary-600/50 transition-colors" />
            <div className="relative bg-gray-900 border-4 border-white/5 rounded-3xl p-4 overflow-hidden shadow-2xl skew-y-3 group-hover:skew-y-0 transition-transform duration-700">
               <img 
                 src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200" 
                 alt="Preview" 
                 className="rounded-2xl opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* --- LOGIN SECTION --- */}
      <section ref={loginRef} className="py-40 px-4 relative bg-[#080808]">
        <div className="max-w-xl mx-auto">
          {/* Header Login */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-900/40 rotate-12 hover:rotate-0 transition-transform duration-500">
              <GraduationCap size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Acceso Docente</h2>
            <p className="text-gray-500 mt-2 font-mono text-sm underline decoration-primary-500 decoration-2">Demo: admin / admin</p>
          </div>

          {/* Login Card Glassmorphism */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-10 shadow-2xl">
              <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-8">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Nombre de Usuario</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                    <input 
                      {...register("username", { required: "El usuario es obligatorio" })}
                      className={`w-full bg-white/[0.03] border ${errors.username ? 'border-red-500' : 'border-white/5'} focus:border-primary-500 focus:bg-white/[0.05] rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-gray-700`}
                      placeholder="Ej: jsmith_docente"
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-xs font-bold mt-1 px-1 uppercase tracking-tighter">{errors.username.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Contraseña de acceso</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      {...register("password", { 
                        required: "La contraseña es obligatoria",
                        minLength: { value: 4, message: "Mínimo 4 caracteres" }
                      })}
                      className={`w-full bg-white/[0.03] border ${errors.password ? 'border-red-500' : 'border-white/5'} focus:border-primary-500 focus:bg-white/[0.05] rounded-xl py-4 pl-12 pr-12 outline-none transition-all placeholder:text-gray-700`}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs font-bold mt-1 px-1 uppercase tracking-tighter">{errors.password.message}</p>}
                </div>

                {/* Extra Options */}
                <div className="flex items-center justify-between text-sm px-1">
                  <label className="flex items-center gap-2 cursor-pointer group/check">
                    <input type="checkbox" className="hidden peer" />
                    <div className="w-5 h-5 border-2 border-white/10 rounded peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all flex items-center justify-center">
                      <CheckCircle size={14} className="text-white scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                    <span className="text-gray-500 group-hover/check:text-gray-300">Recordarme</span>
                  </label>
                  <button type="button" className="text-primary-500 hover:text-primary-400 transition-colors font-bold">¿Olvidó su clave?</button>
                </div>

                {/* Server Error Display */}
                {serverError && (
                  <div className="p-4 bg-red-950/20 border-l-4 border-red-500 text-red-400 text-sm font-bold uppercase tracking-tighter animate-shake">
                    {serverError}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden group/btn bg-primary-600 hover:bg-primary-500 py-5 rounded-xl transition-all shadow-2xl shadow-primary-900/40"
                >
                  <div className={`flex items-center justify-center gap-3 transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-lg font-black uppercase tracking-widest text-white">Entrar al Aula</span>
                    <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                  </div>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">DSystem.</h3>
            <p className="text-gray-500 text-sm max-w-xs uppercase font-bold tracking-widest">Reinventando la gestión académica con tecnología de punta.</p>
          </div>
          <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-gray-500">
             <a href="#" className="hover:text-primary-500 transition-colors">Soporte</a>
             <a href="#" className="hover:text-primary-500 transition-colors">Privacidad</a>
             <a href="#" className="hover:text-primary-500 transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }) => (
  <div className="space-y-4 p-8 rounded-3xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
    <div className="w-14 h-14 bg-white/[0.05] rounded-2xl flex items-center justify-center shadow-lg">
      {icon}
    </div>
    <h3 className="text-xl font-black uppercase italic tracking-tighter">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed uppercase font-semibold tracking-wide">{desc}</p>
  </div>
);

const FeatureItem = ({ title, text }) => (
  <div className="flex items-start gap-4">
    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
    <div>
      <h4 className="font-black uppercase italic tracking-tighter text-gray-200">{title}</h4>
      <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">{text}</p>
    </div>
  </div>
);

export default LandingPage;
