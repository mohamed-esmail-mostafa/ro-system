import { useTranslation } from 'react-i18next'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { DownloadCloud, RefreshCw, X } from 'lucide-react'

export default function PWA() {
    const { t } = useTranslation()
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW()

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    if (!offlineReady && !needRefresh) {
        return null
    }

    return (
        <div className="fixed bottom-5 left-5 z-[9999] max-w-sm rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-5">
            {offlineReady && (
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <DownloadCloud className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {t('pwa.offline_ready')}
                        </p>
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={close}
                                className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                {t('pwa.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {needRefresh && (
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-600 dark:text-cyan-400 shrink-0">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {t('pwa.update_available')}
                        </p>
                        <div className="mt-3 flex items-center justify-end gap-2">
                            <button
                                onClick={close}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                {t('pwa.close')}
                            </button>
                            <button
                                onClick={() => updateServiceWorker(true)}
                                className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700 shadow-sm transition"
                            >
                                {t('pwa.update_button')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}