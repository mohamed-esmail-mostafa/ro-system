import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        VitePWA({
            registerType: 'autoUpdate',

            injectRegister: 'auto',

            includeAssets: [
                'favicon.ico',
                'favicon.svg',
                'app-icon.png',
                'apple-touch-icon.png',
                'pwa-192x192.png',
                'pwa-512x512.png',
            ],

            manifest: {
                name: 'RO System - Water Treatment Management',
                short_name: 'RO System',
                description: 'RO Water Treatment Plant SaaS Management System',

                start_url: '/',
                scope: '/',

                theme_color: '#0891b2',
                background_color: '#ffffff',

                display: 'standalone',
                orientation: 'portrait',

                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },

            devOptions: {
                enabled: true,
                type: 'classic',
            },

            workbox: {
                globPatterns: [
                    '**/*.{js,css,html,ico,png,svg,woff2}',
                ],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
});
