import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from './ui/Layout'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
)
