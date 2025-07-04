import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import { ErrorProvider } from './components/providers/Error.tsx'
import { StaticProvider } from './components/providers/Static.tsx'
import { APICommentService } from './service.ts'
import './styles/index.css'
import type { ImportMetaEnv } from './vite-env.d.ts'
import axios from 'axios'


function getEnv<K extends keyof ImportMetaEnv>(key: K): ImportMetaEnv[K] {
  const value = import.meta.env[key]

  if (!value) {
    throw new Error(`Missing env variable ${key} value`)
  }

  return value
}


const commentService = new APICommentService(getEnv('VITE_BACKEND_URL'))
const staticApi = axios.create({
  baseURL: getEnv('VITE_STATIC_URL')
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StaticProvider api={staticApi}>
      <ErrorProvider>
        <App commentService={commentService} />
      </ErrorProvider>
    </StaticProvider>
  </StrictMode>,
)
