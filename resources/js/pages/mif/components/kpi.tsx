import { Card, CardContent } from '@/components/ui/card'
import useImport from '@/hooks/use-import'
import { ArrowUpRight, FileSpreadsheet, Package, Wrench } from 'lucide-react'
import React from 'react'

export default function KPI({totalFormsCount,totalItemsIssued,totalMaintenanceCount,totalTransfersCount}:any) {
  const {t}=useImport();
    return (
         <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                                <FileSpreadsheet className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {t('inventory.mifSection.kpi.totalForms')}
                                </p>
                                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                    {totalFormsCount}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {t('inventory.mifSection.kpi.itemsIssued')}
                                </p>
                                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                                    {totalItemsIssued}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                                <Wrench className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {t('inventory.mifSection.kpi.maintenanceDirect')}
                                </p>
                                <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                                    {totalMaintenanceCount}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                <ArrowUpRight className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                     {t('inventory.mifSection.kpi.transfers')}
                                </p>
                                <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                                    {totalTransfersCount}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
  )
}
