import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { Droplets, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog';
import { RoUnitFormDialog } from './RoUnitFormDialog';

interface Station {
    id: number;
    name: string;
    code: string;
}

interface RoUnit {
    id: number;
    station_id: number;
    name: string;
    code: string | null;
    capacity: number | null;
    description: string | null;
    serial_number: string | null;
    manufacturer: string | null;
    is_active: boolean;
    station?: { id: number; name: string; code: string };
}

interface RoUnitTableProps {
    roUnits: RoUnit[];
    stations: Station[];
}

export function RoUnitTable({ roUnits, stations }: RoUnitTableProps) {
    const { t } = useTranslation();
    const [editUnit, setEditUnit] = useState<RoUnit | null>(null);
    const [deleteUnit, setDeleteUnit] = useState<RoUnit | null>(null);
    const [deleting, setDeleting] = useState(false);

    function handleDelete() {
        if (!deleteUnit) return;
        setDeleting(true);
        router.delete(`/ro-units/${deleteUnit.id}`, {
            onSuccess: () => {
                toast.success(t('ro-units.deleteSuccess'));
                setDeleteUnit(null);
            },
            onError: () => toast.error(t('common.error')),
            onFinish: () => setDeleting(false),
        });
    }

    if (roUnits.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 dark:border-gray-700 dark:bg-gray-900">
                <Droplets className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('ro-units.noUnits')}</p>
            </div>
        );
    }

    return (
        <>




            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {roUnits.map((unit) => (
                    <div
                        key={unit.id}
                        className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-cyan-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cyan-800"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4 dark:border-gray-800">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 ring-1 ring-cyan-100 dark:bg-cyan-950/40 dark:ring-cyan-900">
                                    <Droplets className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                        {unit.name}
                                    </h3>

                                    <span className="mt-1 inline-flex rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                        {unit.code ?? '—'}
                                    </span>
                                </div>
                            </div>

                            <Badge
                                className={
                                    unit.is_active
                                        ? 'shrink-0 border-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'shrink-0 border-0 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                }
                            >
                                {unit.is_active
                                    ? t('common.active')
                                    : t('common.inactive')}
                            </Badge>
                        </div>

                        {/* Capacity Highlight */}
                        <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/20">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t('ro-units.table.capacity')}
                            </p>

                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="text-2xl font-semibold tracking-tight text-cyan-700 dark:text-cyan-400">
                                    {unit.capacity ?? '—'}
                                </span>

                                {unit.capacity != null && (
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        m³/h
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-4">
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('ro-units.table.station')}
                                </p>
                                <p className="mt-1 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {unit.station?.name ?? '—'}
                                </p>
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('ro-units.table.manufacturer')}
                                </p>
                                <p className="mt-1 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {unit.manufacturer ?? '—'}
                                </p>
                            </div>

                            <div className="col-span-2 min-w-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('ro-units.table.serialNumber')}
                                </p>
                                <p className="mt-1 truncate font-mono text-sm text-gray-700 dark:text-gray-300">
                                    {unit.serial_number ?? '—'}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-500 transition-colors hover:bg-cyan-50 hover:text-cyan-700 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-400"
                                onClick={() => setEditUnit(unit)}
                                title={t('common.edit')}
                                aria-label={t('common.edit')}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>

                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                                onClick={() => setDeleteUnit(unit)}
                                title={t('common.delete')}
                                aria-label={t('common.delete')}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>





            <RoUnitFormDialog
                open={!!editUnit}
                onClose={() => setEditUnit(null)}
                stations={stations}
                roUnit={editUnit}
            />

            <ConfirmDeleteDialog
                open={!!deleteUnit}
                onClose={() => setDeleteUnit(null)}
                onConfirm={handleDelete}
                loading={deleting}
            />
        </>
    );
}
