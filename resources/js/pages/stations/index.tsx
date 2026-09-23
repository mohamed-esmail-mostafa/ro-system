import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { MapPin, Plus } from 'lucide-react';
// import { DashboardLayout } from '../dashboard/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StationTable } from './components/StationTable';
import { StationFormDialog } from './components/StationFormDialog';
import useComapny from '@/hooks/use-comapny';
import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/shared/page-header';
import BackBtn from '@/components/shared/back-btn';

interface Station {
    id: number;
    name: string;
    code: string;
    phone: string | null;
    city: string | null;
    country: string | null;
    address: string | null;
    is_active: boolean;
    ro_units_count?: number;
}

interface PageProps {
    stations: Station[];
}

export default function Stations() {
    const { t } = useTranslation();
    const { stations } = usePage().props as any as PageProps;
    const { company } = useComapny();
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <DashboardLayout>
            <Head title={`${t('stations.title')} — AquaRO`} />

            <div className="space-y-6 p-6">
            
                <PageHeader
                    icon={<MapPin className="h-5 w-5 text-white" />}
                    title={t('stations.title')} subtitle={`${company?.name} - ${t('stations.subtitle')}`}>
                    <div className='flex items-center gap-2'>
                        <Button
                            onClick={() => setCreateOpen(true)}
                            className="flex items-center gap-2 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            {t('stations.create')}
                        </Button>
                        {/* <BackBtn /> */}
                    </div>
                </PageHeader>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {t('common.total')}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                            {stations?.length ?? 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('stations.title')}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {t('common.active')}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {stations?.filter((s) => s.is_active).length ?? 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('stations.title')}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {t('common.inactive')}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-gray-500 dark:text-gray-400">
                            {stations?.filter((s) => !s.is_active).length ?? 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('stations.title')}</p>
                    </div>
                </div>

                {/* Table */}
                <StationTable stations={stations ?? []} />
            </div>

            {/* Create Dialog */}
            <StationFormDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
            />
        </DashboardLayout>
    );
}
