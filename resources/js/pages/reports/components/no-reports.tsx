import { Button } from '@/components/ui/button'
import useImport from '@/hooks/use-import'
import { Link } from '@inertiajs/react'
import { FileText, Plus } from 'lucide-react'


export default function NoReports() {
    const { t } = useImport()
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700 bg-white dark:bg-gray-900">
            <FileText className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="font-semibold text-gray-900 dark:text-white">
                {t('reports.noReports')}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('reports.noReportsSubtitle')}
            </p>
            <Link href="/reports" className="mt-4">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="mr-1.5 h-4 w-4" />
                    {t('reports.newReport')}
                </Button>
            </Link>

        </div>
    )
}
