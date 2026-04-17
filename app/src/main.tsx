import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './index.css'
import App from './App.tsx'
import { theme } from './theme'

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined
const convex = new ConvexReactClient(convexUrl ?? 'https://example.convex.cloud')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ConvexProvider>
  </StrictMode>,
)
