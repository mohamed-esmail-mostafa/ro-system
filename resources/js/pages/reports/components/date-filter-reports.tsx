import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useImport from '@/hooks/use-import'
import { CalendarDays, Filter, X } from 'lucide-react'
import React from 'react'

export default function DateFilterReports({dateFrom,dateTo,setDateFrom,setDateTo,applyFilter,hasFilters,clearFilter}:any) {
    const { t } = useImport();
    return (
        <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Filter className="mb-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            {/* From */}
            <div className="flex flex-col gap-1">
                <Label htmlFor="date_from" className="text-xs">
                    {t('common.from')}
                </Label>
                <Input
                    id="date_from"
                    type="date"
                    className="h-8 w-40 text-sm"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    max={dateTo || undefined}
                />
            </div>

            {/* To */}
            <div className="flex flex-col gap-1">
                <Label htmlFor="date_to" className="text-xs">
                    {t('common.to')}
                </Label>
                <Input
                    id="date_to"
                    type="date"
                    className="h-8 w-40 text-sm"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    min={dateFrom || undefined}
                />
            </div>

            <Button size="sm" onClick={applyFilter} >
                <CalendarDays className="mr-2 h-3.5 w-3.5" />
                {t('common.apply')}
            </Button>

            {hasFilters && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearFilter}
                    className="h-8 text-muted-foreground hover:text-destructive"
                >
                    <X className="mr-1.5 h-3.5 w-3.5" />
                    {t('common.clear')}
                </Button>
            )}
        </div>
    )
}
