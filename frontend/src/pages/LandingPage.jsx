import React, { useState, useRef, useEffect } from 'react';
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
  const { token, login } = useAuth();
  const loginRef = useRef(null);
  
  useEffect(() => {
    if (token) navigate('/dashboard')
  }, [token, navigate])
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { username: 'admin', password: 'admin' }
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
      // Navegación a la nueva ruta plana
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToLogin = () => loginRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 selection:bg-primary-500/30">
      {/* ... Hero Section remains same ... */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="max-w-5xl mx-auto text-center z-10 space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary-400 text-sm font-semibold animate-bounce-slow">
            <Sparkles size={16} className="text-yellow-400" />
            <span>Versión v2.1 Educativa</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
            Sistema <span className="text-primary-500">DSystem</span>
            <br />
            <span className="text-white/20">Gestión Docente</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400 font-medium">La herramienta interactiva para docentes.</p>
          <div className="flex gap-6 mt-8 justify-center">
             <button onClick={scrollToLogin} className="px-10 py-5 bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-primary-900/40">Entrar al Aula</button>
          </div>
        </div>
      </section>

      {/* LOGIN SECTION (Simplificada para depuración) */}
      <section ref={loginRef} className="py-20 px-4 bg-[#080808]">
        <div className="max-w-md mx-auto">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 space-y-8 shadow-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Acceso Directo</h2>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">admin / admin</p>
            </div>
            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6">
               <input {...register("username")} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none" placeholder="Usuario" />
               <input type="password" {...register("password")} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none" placeholder="Password" />
               {serverError && <p className="text-red-500 text-[10px] font-black uppercase text-center">{serverError}</p>}
               <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-500 py-4 rounded-xl font-black uppercase text-white tracking-widest transition-all">
                  {loading ? 'Cargando...' : 'Entrar'}
               </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
