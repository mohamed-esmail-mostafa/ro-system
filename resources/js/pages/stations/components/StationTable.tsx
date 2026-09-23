import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { Droplets, Edit2, MapPin, Phone, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog';
import { StationFormDialog } from './StationFormDialog';
import { Station } from '@/types/ro';



export function StationTable({ stations }: {stations: Station[]}) {
    const { t } = useTranslation();
    const [editStation, setEditStation] = useState<Station | null>(null);
    const [deleteStation, setDeleteStation] = useState<Station | null>(null);
    const [deleting, setDeleting] = useState(false);

    function handleDelete() {
        if (!deleteStation) return;
        setDeleting(true);
        router.delete(`/stations/${deleteStation.id}`, {
            onSuccess: () => {
                toast.success(t('stations.deleteSuccess'));
                setDeleteStation(null);
            },
            onError: () => toast.error(t('common.error')),
            onFinish: () => setDeleting(false),
        });
    }

    if (stations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 dark:border-gray-700 dark:bg-gray-900">
                <MapPin className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('stations.noStations')}</p>
            </div>
        );
    }

    return (
        <>
          
            {stations.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {stations.map((station) => (
                        <div
                            key={station.id}
                            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-900"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                            {station.name}
                                        </h3>

                                        <span className="mt-1 inline-block rounded-md bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                            {station.code}
                                        </span>
                                    </div>
                                </div>

                                {/* Status */}
                                <Badge
                                    variant="default"
                                    className={
                                        station.is_active
                                            ? 'shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'shrink-0 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                    }
                                >
                                    {station.is_active
                                        ? t('common.active')
                                        : t('common.inactive')}
                                </Badge>
                            </div>

                            {/* Divider */}
                            <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

                            {/* Information */}
                            <div className="space-y-3">
                                {/* Phone */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-xs">
                                            {t('stations.table.phone')}
                                        </span>
                                    </div>

                                    <span className="max-w-[150px] truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {station.phone || '—'}
                                    </span>
                                </div>

                                {/* RO Units */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Droplets className="h-4 w-4" />
                                        <span className="text-xs">
                                            {t('stations.table.units')}
                                        </span>
                                    </div>

                                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                        {station.ro_units_count ?? 0}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-5 flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditStation(station)}
                                >
                                    <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                                    {t('common.edit')}
                                </Button>

                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setDeleteStation(station)}
                                >
                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                    {t('common.delete')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
                    <MapPin className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />

                    <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                        {t('stations.empty.title')}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {t('stations.empty.description')}
                    </p>
                </div>
            )}


            <StationFormDialog
                open={!!editStation}
                onClose={() => setEditStation(null)}
                station={editStation}
            />

            <ConfirmDeleteDialog
                open={!!deleteStation}
                onClose={() => setDeleteStation(null)}
                onConfirm={handleDelete}
                loading={deleting}
            />
        </>
    );
}
