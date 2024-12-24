import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import { InMemoryMessageService } from './service.ts'

import './index.css'


const messageService = new InMemoryMessageService()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App messageService={messageService} />
  </StrictMode>,
)
