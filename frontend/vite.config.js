import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':'https://lcnfyb0s62.execute-api.ap-south-1.amazonaws.com/'
    }
  }
})
