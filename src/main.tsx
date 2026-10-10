import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './globals.css'
import App from './app/App.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/query/queryClient.ts'
import {
  loadSettings,
  applySettings,
} from './features/settings/lib/settings.ts'

applySettings(loadSettings())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
