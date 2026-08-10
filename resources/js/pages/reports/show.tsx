import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { DashboardLayout } from '../dashboard/components/DashboardLayout';
import useImport from '@/hooks/use-import';
import NoReports from './components/no-reports';
import DateFilterReports from './components/date-filter-reports';
import ReportsHero from './components/reports-hero';
import ReportCard from './components/report-card';
import { PaginatedReports, Report, RoUnit } from '@/types/ro';
import ReportsPagination from './components/reports-pagination';




interface Filters {
    date_from?: string | null;
    date_to?: string | null;
}

interface ShowReportsProps {
    roUnit: RoUnit;
    reports: PaginatedReports;
    filters: Filters;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ShowReports({ roUnit, reports, filters }: ShowReportsProps) {
    const { t } = useImport();
    const { data = [], current_page, last_page, total, from, to, links = [] } = reports;

    // Filter states
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');
    const hasFilters = !!(filters.date_from || filters.date_to);

    const applyFilter = () => {
        router.visit(`/reports/ro-unit/${roUnit.id}`, {
            data: {
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            },
            preserveScroll: false,
        });
    };

    const clearFilter = () => {
        setDateFrom('');
        setDateTo('');
        router.visit(`/reports/ro-unit/${roUnit.id}`, { preserveScroll: false });
    };

    return (
        <DashboardLayout>
            <Head title={`${roUnit.name} — ${t('reports.showTitle')}`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <ReportsHero
                    roUnit={roUnit}
                    total={total} />


                <DateFilterReports 
                   dateFrom={dateFrom} 
                   dateTo={dateTo} 
                   setDateFrom={setDateFrom} 
                   setDateTo={setDateTo} 
                   applyFilter={applyFilter} 
                   hasFilters={hasFilters} 
                   clearFilter={clearFilter} 
                />

                {/* Daily Reports List */}
                {data.length === 0 ? (
                    <NoReports />
                ) : (
                    <div className="space-y-5">
                        {data.map((report:Report, index:number) => (
                            <ReportCard key={report.id} report={report} index={index} />
                        ))}
                    </div>
                )}

                
                <ReportsPagination 
                   data={data} 
                   total={total} 
                   from={from} 
                   to={to} 
                   links={links} 
                   last_page={last_page}
                    />
            </div>
        </DashboardLayout>
    );
}


