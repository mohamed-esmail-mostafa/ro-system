/// <reference types="vite-plugin-pwa/client" />
import { createInertiaApp } from '@inertiajs/react';
// import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import './i18n/index'
import toast, { Toaster } from 'react-hot-toast';
import '@/hooks/use-pwa-install';
const appName = import.meta.env.VITE_APP_NAME || 'NAQAA';

// Register NAQAA PWA Service Worker
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then((registration) => {
                console.log('NAQAA PWA Service Worker registered, scope:', registration.scope);
            })
            .catch((err) => {
                console.warn('NAQAA PWA Service Worker registration:', err);
            });
    });
}



createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                // return AuthLayout;
                return null;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#00b8a4',
    },
});

// This will set light / dark mode on load...
initializeTheme();
