import React from 'react'
import { DashboardLayout } from '../dashboard/components/DashboardLayout'
import PageTitle from '@/components/shared/page-header'
import useImport from '@/hooks/use-import'

export default function index() {
    const { t } = useImport();
    return (
        <DashboardLayout>
            <div className="container mx-auto p-4">
                <PageTitle title={t('kpi.title')}>

                </PageTitle>
            </div>
        </DashboardLayout>
    )
}
