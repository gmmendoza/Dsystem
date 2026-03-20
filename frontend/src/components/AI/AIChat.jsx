import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, User, Sparkles, Minimize2, Maximize2, MessageSquare } from 'lucide-react';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: '¡Hola! Soy DocenTico, tu asistente inteligente. ¿En qué te puedo ayudar con tus planificaciones hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulación de respuesta IA
    setTimeout(() => {
      const response = getAIResponse(input.toLowerCase());
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query) => {
    if (query.includes('clase') || query.includes('matemática')) {
      return "Podrías iniciar con un juego de 'Preguntas Relámpago' sobre las tablas. Luego, usa el recurso 'Gráfico de Funciones' que ya tienes en tu aula para visualizar la pendiente.";
    }
    if (query.includes('evaluar') || query.includes('evaluación')) {
      return "Para esta unidad, te recomiendo una evaluación formativa mediante una rúbrica de desempeño grupal. ¿Querés que te ayude a redactar los criterios?";
    }
    if (query.includes('objetivo') || query.includes('propósito')) {
      return "Un buen objetivo para primaria sería: 'Lograr que el estudiante identifique y represente funciones lineales en situaciones de la vida cotidiana'.";
    }
    return "Esa es una excelente pregunta. Como docente, podés enfocarlo desde el aprendizaje basado en proyectos (ABP) para aumentar la motivación. ¿Te gustaría profundizar en alguna actividad específica?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Botón Flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary-900/40 transition-all hover:scale-110 active:scale-95 group relative"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse" />
          <Bot size={28} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="w-[380px] h-[550px] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-primary-600/20 to-indigo-600/20 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-white leading-none">DocenTico</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-green-500">Online | AI Assistant</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in fade-in duration-300`}>
                <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'ai' ? 'bg-primary-600/10 text-primary-500' : 'bg-white/5 text-gray-400'}`}>
                    {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'ai' 
                      ? 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5' 
                      : 'bg-primary-600 text-white rounded-tr-none shadow-lg shadow-primary-900/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-600/10 text-primary-500 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl flex gap-1 items-center border border-white/5">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-6 bg-black/40 border-t border-white/5 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary-500/50 transition-all placeholder:text-gray-700"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-800 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-primary-900/20 active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
