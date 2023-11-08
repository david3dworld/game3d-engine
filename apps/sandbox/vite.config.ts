import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import { r3f } from '@react-three/editor/vite'

export default defineConfig((env) => ({
    // plugins: [env.command === 'build' ? react() : r3f()],
    plugins: [
        react(),
        // mkcert()
    ],
    server: {
        // https: true,
    },
}))
