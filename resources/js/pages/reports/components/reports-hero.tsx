import { FileText, Plus } from 'lucide-react'
import React from 'react'
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import useImport from '@/hooks/use-import';
export default function ReportsHero({ roUnit, total }: any) {
    const { t } = useImport();
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 dark:shadow-primary/30">
                        <FileText className="h-7 w-7" />
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {roUnit.name}
                            </h1>
                            {roUnit.code && (
                                <Badge className="bg-primary/20 text-primary border-primary dark:bg-primary/60 dark:text-primary font-mono">
                                    {roUnit.code}
                                </Badge>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {t('reports.showTitle')} &mdash;{' '}
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{total}</span>{' '}
                            {t('reports.reportsCount')}
                        </p>
                    </div>
                </div>

                <Link href="/reports">
                    <Button className="flex items-center gap-2 bg-primary hover:bg-primary">
                        <Plus className="h-4 w-4" />
                        {t('reports.newReport')}
                    </Button>
                </Link>
            </div>
        </div>
    )
}
