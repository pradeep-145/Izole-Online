import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':"https://6wceq59nse.execute-api.ap-south-1.amazonaws.com/"

    }
  }
})
