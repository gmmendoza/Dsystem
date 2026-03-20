import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Bell, ShieldCheck, GraduationCap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-600/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/50 border border-gray-800 text-primary-400 text-sm font-medium animate-fade-in">
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
              onClick={() => navigate('/login')}
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
      </section>

      {/* Features Grid */}
      <section className="pb-24 px-4">
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

      {/* Intro Context */}
      <section className="py-20 bg-gray-900/40 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Por qué elegir DSystem?</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            En el mundo educativo actual, la organización es clave. DSystem centraliza el control de tus alumnos, 
            calificaciones y agendas en una sola página fluida (SPA), permitiéndote enfocarte en lo que mejor sabes hacer: enseñar.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm font-medium text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl text-white font-bold">100%</span>
              <span>Responsive</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl text-white font-bold">Fast</span>
              <span>Vite Native</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl text-white font-bold">Modern</span>
              <span>Tailwind Built</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-gray-900">
        &copy; 2026 DSystem - Plataforma de Gestión de Docentes.
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
