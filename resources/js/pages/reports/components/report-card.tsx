import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useImport from '@/hooks/use-import';
import { Report } from '@/types/ro';
import { Calendar, ChevronDown, ChevronRight, ChevronUp, ClipboardList, Clock, Layers, Lightbulb } from 'lucide-react';

export default function ReportCard({ report, index }: { report: Report, index: number }) {
    const { t } = useImport();
    const [expanded, setExpanded] = useState(index === 0);
    const categories = report.categories || [];
    const totalParams = categories.reduce((sum, cat) => sum + (cat.parameters?.length || 0), 0);

    const formattedDate = new Date(report.report_date).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });



    const runningHoursParam = report.categories
        ?.flatMap((category) => category.parameters ?? [])
        .find((param) => param.code === 'RUNNING_HOURS');

    const runningHours = Math.max(
        0,
        Number(runningHoursParam?.difference ?? 0)
    );

    const runningHoursPercent = Math.min(
        (runningHours / 24) * 100,
        100
    );

    const radius = 42;
    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset =
        circumference - (runningHoursPercent / 100) * circumference;


    return (
        <Card className="overflow-hidden border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            {/* Header Accordion Bar */}
            <div
                onClick={() => setExpanded((v) => !v)}
                className="flex cursor-pointer flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between bg-gray-50/60 hover:bg-gray-100/60 dark:bg-gray-900/60 dark:hover:bg-gray-800/40 transition border-b border-gray-100 dark:border-gray-800"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white dark:bg-primary dark:text-white font-bold">
                        #{report.id}
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                {formattedDate} 
                            </h3>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          
                            {report?.operator_name}
                        </p>
                    </div>
                </div>






             <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
    <div className="flex items-center gap-4">
        {/* Circular Progress */}
        <div className="relative h-24 w-24 shrink-0">
            <svg
                className="h-24 w-24 -rotate-90"
                viewBox="0 0 100 100"
            >
                {/* Background */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-blue-100 dark:text-blue-950"
                />

                {/* Progress */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="text-blue-600 dark:text-blue-400 transition-all duration-700"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </svg>

            {/* Center Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {runningHours}
                </span>

                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    / 24 {t('reports.hours')}
                </span>
            </div>
        </div>

        {/* Information */}
        <div>
            <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    <Clock className="h-4 w-4" />
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                    {t('reports.runningHours')}
                </h4>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('reports.dailyOperatingTime')}
            </p>

            <p className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                {runningHoursPercent.toFixed(0)}% {t('reports.dailyCapacity')}
            </p>
        </div>
    </div>
</div>







                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <Badge variant="secondary" className="gap-1 font-medium text-xs">
                        <Layers className="h-3 w-3 text-gray-500" />
                        {categories.length} {t('common.categories')} ({totalParams} {t('reports.parameter') || 'Params'})
                    </Badge>

                    {expanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                </div>
            </div>

            {/* Expandable Body */}
            {expanded && (
                <CardContent className="space-y-6 p-6">
                    {/* Section 1: Actions Taken & Recommendations Grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Actions Taken Box */}
                        <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-4 dark:border-teal-900/40 dark:bg-teal-950/20">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                                    <ClipboardList className="h-4 w-4" />
                                </div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300">
                                    {t('reports.actionsTaken')}
                                </h4>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-9 rtl:pl-0 rtl:pr-9">
                                {report.actions ? (
                                    report.actions
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                                        {t('reports.noActions')}
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Recommendations Box */}
                        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                    <Lightbulb className="h-4 w-4" />
                                </div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                                    {t('reports.recommendationsNotes')}
                                </h4>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-9 rtl:pl-0 rtl:pr-9">
                                {report.recommendations ? (
                                    report.recommendations
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                                        {t('reports.noRecommendations')}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Reading Categories & Parameter Values Tables */}
                    <div className="space-y-5 pt-2">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/40"
                            >
                                {/* Category Header */}
                                <div className="bg-gray-100/80 px-4 py-2.5 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                        {category.name}
                                    </h4>
                                </div>

                                {/* Parameter Table */}
                                <div className="p-4 overflow-x-auto">
                                    <table className="w-full text-left text-sm rtl:text-right">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-xs uppercase font-semibold text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                                <th className="pb-2 pl-2 rtl:pr-2 rtl:pl-0">{t('reports.parameter')}</th>
                                                <th className="pb-2 text-center">{t('reports.previousValue')}</th>
                                                <th className="pb-2 text-center">{t('reports.currentValue')}</th>
                                                <th className="pb-2 text-center">{t('reports.difference')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {category.parameters.map((param: any) => {
                                                const diffVal = param.difference !== null && param.difference !== undefined ? parseFloat(String(param.difference)) : null;
                                                const isPositive = diffVal !== null && diffVal > 0;
                                                const isNegative = diffVal !== null && diffVal < 0;

                                                return (
                                                    <tr key={param.id} className="hover:bg-white/60 dark:hover:bg-gray-800/40 transition">
                                                        {/* Parameter Name & Unit */}
                                                        <td className="py-2.5 pl-2 rtl:pr-2 rtl:pl-0">
                                                            <div className="flex items-center gap-2">
                                                                <ChevronRight className="h-3.5 w-3.5 text-teal-500 shrink-0 rtl:rotate-180" />
                                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                                    {param.name}
                                                                </span>
                                                                {param.unit && (
                                                                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 font-mono dark:bg-gray-800 dark:text-gray-400">
                                                                        {param.unit}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Previous Value */}
                                                        <td className="py-2.5 text-center font-mono text-gray-600 dark:text-gray-300">
                                                            {param.previous_value !== null && param.previous_value !== undefined && param.previous_value !== ''
                                                                ? param.previous_value
                                                                : '—'}
                                                        </td>

                                                        {/* Current Value */}
                                                        <td className="py-2.5 text-center font-mono font-bold text-gray-900 dark:text-white">
                                                            {param.current_value !== null && param.current_value !== undefined && param.current_value !== ''
                                                                ? param.current_value
                                                                : '—'}
                                                        </td>

                                                        {/* Difference Badge */}
                                                        <td className="py-2.5 text-center">
                                                            {diffVal === null || isNaN(diffVal) ? (
                                                                <span className="text-gray-400 font-mono">—</span>
                                                            ) : (
                                                                <Badge
                                                                    className={`font-mono text-xs font-bold ${isPositive
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                                        : isNegative
                                                                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300'
                                                                            : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                                                        }`}
                                                                >
                                                                    {isPositive ? `+${diffVal}` : diffVal}
                                                                </Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
