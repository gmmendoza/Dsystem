import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { AIProvider } from './context/AIContext'

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HashRouter>
        <ThemeProvider>
          <AIProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </AIProvider>
        </ThemeProvider>
      </HashRouter>
    </React.StrictMode>
  )
} catch (error) {
  console.error('FATAL:', error)
}
