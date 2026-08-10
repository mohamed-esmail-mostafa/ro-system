import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Share, X, CheckCircle2 } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
}

declare global {
    interface Window {
        deferredPWAInstallPrompt?: BeforeInstallPromptEvent | null
    }
}

export default function InstallPWA() {
    const { t } = useTranslation()
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstalled, setIsInstalled] = useState(false)
    const [isIOS, setIsIOS] = useState(false)
    const [dismissed, setDismissed] = useState(false)
    const [justInstalled, setJustInstalled] = useState(false)

    useEffect(() => {
        // 1. Check if already running in standalone mode (installed)
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (navigator as any).standalone === true ||
            document.referrer.includes('android-app://')

        if (isStandalone) {
            setIsInstalled(true)
            return
        }

        // 2. Check if dismissed recently in localStorage
        const lastDismissed = localStorage.getItem('pwa_install_dismissed')
        if (lastDismissed) {
            const timePassed = Date.now() - parseInt(lastDismissed, 10)
            // Dismiss for 3 days
            if (timePassed < 3 * 24 * 60 * 60 * 1000) {
                setDismissed(true)
            }
        }

        // 3. Detect iOS Safari
        const userAgent = window.navigator.userAgent.toLowerCase()
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream
        setIsIOS(isIosDevice)

        // 4. Capture beforeinstallprompt event
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault()
            const pwaEvent = event as BeforeInstallPromptEvent
            window.deferredPWAInstallPrompt = pwaEvent
            setInstallPrompt(pwaEvent)
        }

        // Check if event was captured globally before mount
        if (window.deferredPWAInstallPrompt) {
            setInstallPrompt(window.deferredPWAInstallPrompt)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        // 5. Capture appinstalled event
        const handleAppInstalled = () => {
            setIsInstalled(true)
            setInstallPrompt(null)
            window.deferredPWAInstallPrompt = null
            setJustInstalled(true)
            setTimeout(() => setJustInstalled(false), 4000)
        }

        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const handleInstall = async () => {
        if (!installPrompt) return

        try {
            await installPrompt.prompt()
            const { outcome } = await installPrompt.userChoice
            if (outcome === 'accepted') {
                setIsInstalled(true)
                setInstallPrompt(null)
                window.deferredPWAInstallPrompt = null
            }
        } catch (error) {
            console.error('PWA install error:', error)
        }
    }

    const handleDismiss = () => {
        setDismissed(true)
        localStorage.setItem('pwa_install_dismissed', Date.now().toString())
    }

    if (isInstalled || dismissed) {
        if (justInstalled) {
            return (
                <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-semibold">{t('pwa.installed')}</span>
                </div>
            )
        }
        return null
    }

    // Standard Android / Desktop Install Prompt
    if (installPrompt) {
        return (
            <div className="fixed bottom-5 right-5 z-[9999] max-w-sm rounded-2xl border border-cyan-500/20 bg-white/95 dark:bg-gray-900/95 p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-5">
                <div className="flex items-start gap-3">
                    <img
                        src="/app-icon.png"
                        alt="RO System"
                        className="h-12 w-12 rounded-xl shadow-sm object-cover border border-cyan-100 dark:border-gray-800 shrink-0"
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                                {t('pwa.install_title')}
                            </h4>
                            <button
                                onClick={handleDismiss}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            {t('pwa.install_desc')}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <button
                                onClick={handleInstall}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-600/25 hover:bg-cyan-700 active:scale-95 transition"
                            >
                                <Download className="h-4 w-4" />
                                {t('pwa.install_button')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // iOS Safari Instructions Prompt
    if (isIOS) {
        return (
            <div className="fixed bottom-5 right-5 z-[9999] max-w-sm rounded-2xl border border-cyan-500/20 bg-white/95 dark:bg-gray-900/95 p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-5">
                <div className="flex items-start gap-3">
                    <img
                        src="/app-icon.png"
                        alt="RO System"
                        className="h-12 w-12 rounded-xl shadow-sm object-cover border border-cyan-100 dark:border-gray-800 shrink-0"
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                                {t('pwa.ios_title')}
                            </h4>
                            <button
                                onClick={handleDismiss}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex items-center gap-1">
                            {t('pwa.ios_instruction')}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return null
}