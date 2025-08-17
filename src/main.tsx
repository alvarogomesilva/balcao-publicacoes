import { Provider } from "@/components/ui/provider"
//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <Provider>
       <Toaster 
          richColors
          position="top-center" 
          duration={1700}
          />
      <App />
    </Provider>
)
