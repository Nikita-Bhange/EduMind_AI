import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext.jsx'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
        <Toaster position='top-rigit' toastOptions={{duration:3000}}/>
        <App />
    </AuthProvider>
  
  </StrictMode>,
)
