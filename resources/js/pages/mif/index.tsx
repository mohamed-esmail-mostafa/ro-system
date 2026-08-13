import { Head } from '@inertiajs/react';
import {
    ArrowUpRight,
    FileSpreadsheet,
    Package,
    Plus,
    Search,
    Wrench,
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '../dashboard/components/DashboardLayout';
import CreateMIFDialog from './components/create-mif-dialog';
import MIFFormCard from './components/mif-form-card';
import type { IndexProps } from './types';
import PageTitle from '@/components/shared/page-title';
import KPI from './components/kpi';
import SearchBar from './components/search-bar';

export default function MIFPage({ stations = [], forms = [], users = [] }: IndexProps) {
    const { t } = useTranslation();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Compute Metrics
    const totalFormsCount = forms.length;
    const totalItemsIssued = forms.reduce((sum, f) => sum + (f.items?.length || 0), 0);
    const totalMaintenanceCount = forms.filter((f) => f.is_maintenance_direct_issue).length;
    const totalTransfersCount = forms.filter((f) => f.is_transfer).length;

    // Filter Forms
    const filteredForms = forms.filter((form) => {
        if (!searchQuery.trim()) {
            return true;
        }

        const q = searchQuery.toLowerCase();

        return (
            form.form_number.toLowerCase().includes(q) ||
            form.from_location?.toLowerCase().includes(q) ||
            form.store_location?.toLowerCase().includes(q) ||
            form.remarks?.toLowerCase().includes(q) ||
            form.issuedBy?.name.toLowerCase().includes(q) ||
            form.recievedBy?.name.toLowerCase().includes(q) ||
            form.items.some(
                (item) =>
                    item.material_description?.toLowerCase().includes(q) ||
                    item.item_code?.toLowerCase().includes(q)
            )
        );
    });

    return (
        <DashboardLayout>
            <Head title={`${t('inventory.mifSection.title')} — AquaRO`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header Banner */}

                <PageTitle
                    icon={<FileSpreadsheet />}
                    title={t('inventory.mifSection.title')}
                    subtitle={t('inventory.mifSection.subtitle')} >
                    <Button
                        onClick={() => setCreateDialogOpen(true)}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 font-bold"
                    >
                        <Plus className="h-4 w-4" />
                        {t('inventory.mifSection.create')}
                    </Button>
                </PageTitle>

                {/* KPI Metrics */}
             
                <KPI
                    totalFormsCount={totalFormsCount}
                    totalItemsIssued={totalItemsIssued}
                    totalMaintenanceCount={totalMaintenanceCount}
                    totalTransfersCount={totalTransfersCount}
                />

                {/* Search Bar */}
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* Forms List Container */}
                {filteredForms.length === 0 ? (
                    <Card className="border-gray-200 p-12 text-center shadow-sm dark:border-gray-800">
                        <CardContent className="flex flex-col items-center justify-center space-y-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                                <FileSpreadsheet className="h-8 w-8" />
                            </div>
                            <div className="max-w-sm space-y-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {t('inventory.mifSection.noForms')}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('inventory.mifSection.subtitle')}
                                </p>
                            </div>
                            <Button
                                onClick={() => setCreateDialogOpen(true)}
                                className="bg-teal-600 hover:bg-teal-700 font-bold"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                {t('inventory.mifSection.create')}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {filteredForms.map((form, idx) => (
                            <MIFFormCard key={form.id} form={form} defaultExpanded={idx === 0} />
                        ))}
                    </div>
                )}
            </div>

            {/* Create MIF Dialog */}
            <CreateMIFDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                stations={stations}
                users={users}
            />
        </DashboardLayout>
    );
}
