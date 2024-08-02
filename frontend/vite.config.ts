import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { normalizePath } from 'vite'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            isProduction: process.env.NODE_ENV === 'production'
        }),
        // only build
        // https://github.com/sapphi-red/vite-plugin-static-copy/discussions/77
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(path.resolve(__dirname, './error.html')),
                    dest: './'
                }
            ]
        })[1]
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})