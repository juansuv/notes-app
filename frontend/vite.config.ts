import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      hocs: "/src/hocs",
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Asegúrate de incluir ".jsx
  },
})
