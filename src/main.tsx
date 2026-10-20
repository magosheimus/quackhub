import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/vt323/400.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import '@fontsource/share-tech-mono/400.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import '@fontsource/courier-prime/400.css'
import '@fontsource/courier-prime/700.css'
import '@fontsource/pixelify-sans/400.css'
import '@fontsource/pixelify-sans/500.css'
import '@fontsource/pixelify-sans/600.css'
import './index.css'
import './globals.css'
import App from './app/App.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/query/queryClient.ts'
import {
  loadSettings,
  applySettings,
} from './features/settings/lib/settings.ts'
import { applyUiScale, loadUiScale } from './features/settings/lib/uiScale.ts'

applySettings(loadSettings())
applyUiScale(loadUiScale())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
