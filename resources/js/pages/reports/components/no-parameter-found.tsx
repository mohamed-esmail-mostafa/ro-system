import useImport from '@/hooks/use-import'
import { NotepadTextDashed } from 'lucide-react'
import React from 'react'

export default function NoParameterFound() {
    const { t } = useImport()
    return (
        <div className="flex items-center justify-center flex-col py-6 opacity-60">
            <NotepadTextDashed size={32} className="text-gray-400 mb-3" />
            <span className="text-sm text-gray-500 font-medium">
                {t('readings.no-parameters', 'No parameters found in this category')}
            </span>
        </div>
    )
}
