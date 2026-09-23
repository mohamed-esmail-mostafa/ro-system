
import {  Globe2 } from 'lucide-react'

import useToggleLang from '@/hooks/use-toggle-lang';
import useImport from '@/hooks/use-import';

export default function LanguageSelector() {
    const { t, isRtl } = useImport()
    const { toggleLanguage } = useToggleLang()
    return (

        <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-2 text-xs font-bold text-foreground shadow-xs transition hover:bg-accent hover:text-primary"
            title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
        >
            <Globe2 size={14} className="text-primary" />

            <span>
                {isRtl ? 'EN' : 'العربية'}
            </span>
        </button>
    )
}
