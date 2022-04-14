import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {createUmi} from '@vite-umi/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      createUmi({

      })
  ]
})
