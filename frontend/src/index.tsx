import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import { APIMessageService } from './service.ts'

import './index.css'


const messageService = new APIMessageService()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App messageService={messageService} />
  </StrictMode>,
)
