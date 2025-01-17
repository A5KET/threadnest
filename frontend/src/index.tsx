import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import { ErrorProvider } from './components/providers/Error.tsx'
import { StaticProvider } from './components/providers/Static.tsx'
import { APIMessageService } from './service.ts'
import './styles/index.css'
import type { ImportMetaEnv } from './vite-env.d.ts'


function getEnv<K extends keyof ImportMetaEnv>(key: K): ImportMetaEnv[K] {
  const value = import.meta.env[key]

  if (!value) {
    throw new Error(`Missing env variable ${key} value`)
  }

  return value
}


const messageService = new APIMessageService(getEnv('VITE_BACKEND_URL'))

const staticPath = getEnv('VITE_STATIC_URL')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StaticProvider staticRoot={staticPath}>
      <ErrorProvider>
        <App messageService={messageService} />
      </ErrorProvider>
    </StaticProvider>
  </StrictMode>,
)
