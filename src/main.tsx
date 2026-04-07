import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // O seu componente de roteamento
import { SalonProvider } from './context/SalonContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SalonProvider>
      <App />
    </SalonProvider>
  </React.StrictMode>,
)