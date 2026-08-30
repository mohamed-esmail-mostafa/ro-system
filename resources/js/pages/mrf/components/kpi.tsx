import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownLeft, Building2, FileCheck2, Inbox } from 'lucide-react';
import { MaterialReceivingForm, Station } from '../types';

interface MRFKpiProps {
    forms: MaterialReceivingForm[];
    stations: Station[];
}

export function MRFKpi({ forms = [], stations = [] }: MRFKpiProps) {
    const totalFormsCount = forms.length;
    const totalItemsReceived = forms.reduce((sum, f) => sum + (f.items?.length || 0), 0);
    const totalQuantity = forms.reduce(
        (sum, f) => sum + (f.items || []).reduce((iSum, i) => iSum + (i.quantity || 0), 0),
        0
    );

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        <FileCheck2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Total MRF Forms
                        </p>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            {totalFormsCount}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                        <Inbox className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Materials Received
                        </p>
                        <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
                            {totalItemsReceived}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        <ArrowDownLeft className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Total Quantity Added
                        </p>
                        <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                            +{totalQuantity.toLocaleString()}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Active Stations
                        </p>
                        <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            {stations.length}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
