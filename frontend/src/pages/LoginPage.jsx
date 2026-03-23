import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { GraduationCap, Lock, User, Loader2, Sparkles, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await authAPI.login({ username, password })
      login(data.token, { username: data.username, rol: data.rol })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden selection:bg-primary-500/30">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-primary-600 rounded-3xl mb-6 shadow-2xl shadow-primary-950/40 relative">
             <div className="absolute inset-0 bg-primary-400 rounded-3xl blur-lg opacity-20 animate-pulse" />
             <GraduationCap className="w-12 h-12 text-white relative z-10" />
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white mb-2">
            D<span className="text-primary-500">System</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-ping" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Mente Artificial Educativa</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Glass Card */}
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-3xl shadow-black/50 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles size={120} className="text-white rotate-12" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Identificación</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary-500/50 transition-all placeholder:text-slate-700"
                      placeholder="DNI o Usuario..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Clave de Acceso</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary-500/50 transition-all placeholder:text-slate-700"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-bold flex items-center gap-2"
                  >
                    <ShieldCheck size={14} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-black uppercase italic tracking-widest py-4 rounded-2xl shadow-xl shadow-primary-950/40 active:scale-95 transition-all text-[10px] flex items-center justify-center gap-3 group"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    Entrar al Aula Pro
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center relative z-10">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                Acceso exclusivo para <span className="text-slate-400">Docentes Autorizados</span>
              </p>
              <p className="mt-3 text-[8px] font-bold text-slate-700">
                Demo Credentials: admin / password
              </p>
            </div>
          </div>
        </motion.div>

        <p className="text-center mt-12 text-[8px] font-black uppercase tracking-[0.5em] text-slate-700">
          Powered by DocenTico Engine v3.0
        </p>
      </div>
    </div>
  )
}
