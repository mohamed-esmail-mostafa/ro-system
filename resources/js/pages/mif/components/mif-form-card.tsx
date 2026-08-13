import {
    Building2,
    Calendar,
    ChevronDown,
    ChevronUp,
    Layers,
    MapPin,
    Package,
    UserCheck,
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { MIFFormCardProps } from '../types';
import { formatDate } from '@/helper/date-formatter';

export default function MIFFormCard({ form, defaultExpanded = false }: MIFFormCardProps) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(defaultExpanded);
    const items = form.items || [];

    return (
        <Card className="overflow-hidden border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 p-0">
            {/* Header Accordion Bar */}
            <div
                onClick={() => setExpanded((v) => !v)}
                className="flex cursor-pointer flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between bg-gray-50/60 hover:bg-gray-100/60 dark:bg-gray-900/60 dark:hover:bg-gray-800/40 transition border-b border-gray-100 dark:border-gray-800"
            >
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                {form.form_number}
                            </h3>
                            {form.is_transfer && (
                                <Badge className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300">
                                    {t('inventory.mifSection.isTransfer')}
                                </Badge>
                            )}
                            {form.is_maintenance_direct_issue && (
                                <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300">
                                    {t('inventory.mifSection.isMaintenanceDirectIssue')}
                                </Badge>
                            )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            {form.from_location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                    {form.from_location} {form.store_location ? `→ ${form.store_location}` : ''}
                                </span>
                            )}
                            {form.from_date && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                    {/* {form.from_date} */}
                                    {formatDate(form.from_date)}
                                </span>
                            )}
                            {form.issuedBy && (
                                <span className="flex items-center gap-1">
                                    <UserCheck className="h-3.5 w-3.5 text-teal-500" />
                                    {t('inventory.mifSection.issuedBy')}: <strong>{form.issuedBy.name}</strong>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <Badge variant="outline" className="gap-1 font-semibold text-xs border-teal-200 text-teal-700 dark:border-teal-900 dark:text-teal-300">
                        <Package className="h-3.5 w-3.5" />
                        {items.length} {t('inventory.mifSection.items')}
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
                    {/* Form Metadata Box */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs bg-gray-50/50 p-4 rounded-xl dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                        <div>
                            <span className="block font-medium text-gray-400">{t('inventory.mifSection.issuedBy')}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                                {form.issuedBy ? form.issuedBy.name : '—'}
                            </span>
                        </div>

                        <div>
                            <span className="block font-medium text-gray-400">{t('inventory.mifSection.recievedBy')}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                                {form.recievedBy ? form.recievedBy.name : '—'}
                            </span>
                        </div>

                        <div>
                            <span className="block font-medium text-gray-400">{t('inventory.mifSection.remarks')}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block italic">
                                {form.remarks || '—'}
                            </span>
                        </div>
                    </div>

                    {/* Issued Material Items Table */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Layers className="h-4 w-4 text-teal-600" />
                            {t('inventory.mifSection.items')}
                        </h4>

                        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                            <table className="w-full text-left text-sm rtl:text-right">
                                <thead>
                                    <tr className="bg-gray-100/70 dark:bg-gray-800 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 dark:border-gray-800">
                                        <th className="p-3">#</th>
                                        <th className="p-3">{t('inventory.mifSection.itemCode')}</th>
                                        <th className="p-3">{t('inventory.mifSection.materialDescription')}</th>
                                        <th className="p-3">{t('inventory.mifSection.pmOrder')}</th>
                                        <th className="p-3 text-center">{t('inventory.mifSection.balance')}</th>
                                        <th className="p-3 text-center text-teal-600 dark:text-teal-400">{t('inventory.mifSection.quantity')}</th>
                                        <th className="p-3 text-center">{t('inventory.mifSection.balanceAfter')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                                            <td className="p-3 font-mono text-xs text-gray-400">#{item.serial_number || idx + 1}</td>
                                            <td className="p-3 font-mono font-bold text-gray-900 dark:text-white">
                                                {item.item_code || '—'}
                                            </td>
                                            <td className="p-3">
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {item.material_description}
                                                </div>
                                                {item.station && (
                                                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                        <Building2 className="h-3 w-3" />
                                                        {item.station.name}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-300">
                                                {item.pm_order || '—'}
                                            </td>
                                            <td className="p-3 text-center font-mono text-gray-500">
                                                {item.balance} <span className="text-xs font-normal">{item.unit}</span>
                                            </td>
                                            <td className="p-3 text-center font-mono font-bold text-teal-600 dark:text-teal-400">
                                                -{item.quantity} <span className="text-xs font-normal">{item.unit}</span>
                                            </td>
                                            <td className="p-3 text-center font-mono font-semibold text-gray-800 dark:text-gray-200">
                                                {item.balance_after} <span className="text-xs font-normal">{item.unit}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
