import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../context/ProviderContext.jsx'
import { ChatProvider } from '../context/ChatContext.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppProvider>
    <ChatProvider>
    <App />
    </ChatProvider>
    </AppProvider>
  </BrowserRouter>,
)
