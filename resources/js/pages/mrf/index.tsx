import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '../dashboard/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PackageCheck, Plus } from 'lucide-react';

import { IndexProps } from './types';
import { MRFKpi } from './components/kpi';
import { MRFSearchBar } from './components/search-bar';
import { MRFFormCard } from './components/mrf-form-card';
import { CreateMRFDialog } from './components/create-mrf-dialog';

export default function MRFPage({ stations = [], forms = [], users = [] }: IndexProps) {
    const { t } = useTranslation();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Forms
    const filteredForms = forms.filter((form) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            form.form_number.toLowerCase().includes(q) ||
            form.location?.toLowerCase().includes(q) ||
            form.from_plant?.toLowerCase().includes(q) ||
            form.store_location?.toLowerCase().includes(q) ||
            form.remarks?.toLowerCase().includes(q) ||
            form.receivedBy?.name.toLowerCase().includes(q) ||
            form.approvedBy?.name.toLowerCase().includes(q) ||
            form.items.some(
                (item) =>
                    item.material_description?.toLowerCase().includes(q) ||
                    item.item_code?.toLowerCase().includes(q)
            )
        );
    });

    return (
        <DashboardLayout>
            <Head title={`${t('inventory.mrfSection.title')} — AquaRO`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header Banner */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <PackageCheck className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                            {t('inventory.mrfSection.title')}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {t('inventory.mrfSection.subtitle')}
                        </p>
                    </div>

                    <Button
                        onClick={() => setCreateDialogOpen(true)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 font-bold"
                    >
                        <Plus className="h-4 w-4" />
                        {t('inventory.mrfSection.create')}
                    </Button>
                </div>

                {/* KPI Metrics */}
                <MRFKpi forms={forms} stations={stations} />

                {/* Search Bar */}
                <MRFSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

                {/* Forms List Container */}
                {filteredForms.length === 0 ? (
                    <Card className="border-gray-200 p-12 text-center shadow-sm dark:border-gray-800">
                        <CardContent className="flex flex-col items-center justify-center space-y-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                <PackageCheck className="h-8 w-8" />
                            </div>
                            <div className="max-w-sm space-y-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {t('inventory.mrfSection.noForms')}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('inventory.mrfSection.subtitle')}
                                </p>
                            </div>
                            <Button
                                onClick={() => setCreateDialogOpen(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                {t('inventory.mrfSection.create')}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {filteredForms.map((form, idx) => (
                            <MRFFormCard key={form.id} form={form} defaultExpanded={idx === 0} />
                        ))}
                    </div>
                )}
            </div>

            {/* Create MRF Dialog */}
            <CreateMRFDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                stations={stations}
                users={users}
            />
        </DashboardLayout>
    );
}
