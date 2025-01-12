import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { APIMessageService } from './service.ts'

import { ErrorProvider } from './components/providers/Error.tsx'
import App from './components/App.tsx'
import './styles/index.css'


const messageService = new APIMessageService()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorProvider>
      <App messageService={messageService} />
    </ErrorProvider>
  </StrictMode>,
)
