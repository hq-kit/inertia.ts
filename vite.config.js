import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { watch } from 'vite-plugin-watch'

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        watch({
            pattern: 'routes/web.php',
            command: 'php artisan ziggy:generate',
        }),
    ],
    resolve: {
        alias: {
            'ziggy-js': resolve('vendor/tightenco/ziggy'),
        },
    },
})
