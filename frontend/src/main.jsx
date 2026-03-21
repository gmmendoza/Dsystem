import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { AIProvider } from './context/AIContext'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white p-10 font-sans">
          <h1 className="text-2xl font-black uppercase italic mb-4">Error Detectado</h1>
          <p className="opacity-70 mb-8 max-w-md text-center">{this.state.error?.message}</p>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/Dsystem/'; }}
            className="px-8 py-3 bg-primary-600 rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            Limpiar Cache y Reiniciar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ErrorBoundary>
        <HashRouter>
          <ThemeProvider>
            <AIProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </AIProvider>
          </ThemeProvider>
        </HashRouter>
      </ErrorBoundary>
    </React.StrictMode>
  )
} catch (error) {
  console.error('FATAL:', error)
}

