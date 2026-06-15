import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1c1c1e',
            color: '#fff',
            borderRadius: '999px',
            fontSize: '0.875rem',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#1c1c1e' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#1c1c1e' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
