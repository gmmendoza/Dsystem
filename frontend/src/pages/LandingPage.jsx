import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { ArrowRight, BookOpen, Calendar, Bell, ShieldCheck, GraduationCap, Lock, User, Loader2, ChevronDown } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginRef = useRef(null);

  // Login States
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.login({ username, password });
      login(data.token, { username: data.username, rol: data.rol });
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-600/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/50 border border-gray-800 text-primary-400 text-sm font-medium">
            <GraduationCap size={18} />
            <span>Sistema de Gestión Docente v2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-primary-200 to-gray-500 bg-clip-text text-transparent">
            DSystem: Potenciando<br />el Aula del Futuro
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
            Una plataforma integral diseñada para que los docentes gestionen sus cursos, 
            estudiantes y planificaciones académicas con una interfaz premium y moderna.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={scrollToLogin}
              className="group flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-primary-600/20"
            >
              Comenzar Ahora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-gray-200 font-bold rounded-xl border border-gray-800 transition-all duration-300">
              Ver Características
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce">
          <ChevronDown className="text-gray-600" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gray-900/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Calendar className="text-blue-400" />}
            title="Agenda Inteligente"
            desc="Sincroniza tus clases y eventos con FullCalendar integrado."
          />
          <FeatureCard 
            icon={<BookOpen className="text-purple-400" />}
            title="Planificador"
            desc="Crea y edita tus planes de estudio con validación avanzada."
          />
          <FeatureCard 
            icon={<Bell className="text-yellow-400" />}
            title="Avisos Real-time"
            desc="Notificaciones instantáneas mediante WebSockets."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-green-400" />}
            title="Seguridad Total"
            desc="Autenticación stateless con JWT y encriptación BCrypt."
          />
        </div>
      </section>

      {/* Login Section */}
      <section ref={loginRef} className="py-24 px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-primary-600/5 blur-[100px] rounded-full -z-10" />
        
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Acceso al Sistema</h2>
            <p className="text-gray-400 italic font-mono text-sm">Demo: admin / admin</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm bg-opacity-80">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="label">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Tu usuario"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary-600/10"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    Entrar al Aula
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 text-center text-gray-600 text-sm border-t border-gray-900">
        <p className="mb-2">&copy; 2026 DSystem - Desarrollado para la Gestión Educativa Moderna.</p>
        <p className="text-gray-700">Powered by Spring Boot 3.2 & React 18</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="card p-6 border-gray-800/50 hover:border-primary-600/50 transition-all duration-500 group">
    <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
