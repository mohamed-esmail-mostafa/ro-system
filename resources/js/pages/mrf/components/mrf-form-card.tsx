import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Building2,
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Inbox,
    Layers,
    MapPin,
    UserCheck,
} from 'lucide-react';
import { MaterialReceivingForm } from '../types';

interface MRFFormCardProps {
    form: MaterialReceivingForm;
    defaultExpanded?: boolean;
}

export function MRFFormCard({ form, defaultExpanded = false }: MRFFormCardProps) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(defaultExpanded);

    const items = form.items || [];

    return (
        <Card className="overflow-hidden border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            {/* Header Accordion Bar */}
            <div
                onClick={() => setExpanded((v) => !v)}
                className="flex cursor-pointer flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between bg-gray-50/60 hover:bg-gray-100/60 dark:bg-gray-900/60 dark:hover:bg-gray-800/40 transition border-b border-gray-100 dark:border-gray-800"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold font-mono">
                        #{form.form_number}
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            {form.form_number}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            {form.from_plant && (
                                <span className="flex items-center gap-1">
                                    <Building2 className="h-3.5 w-3.5 text-gray-400" />
                                    {t('inventory.mrfSection.fromPlant')}: <strong>{form.from_plant}</strong>
                                </span>
                            )}
                            {form.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                    {form.location}
                                </span>
                            )}
                            {form.from_date && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                    {form.from_date}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <Badge variant="outline" className="gap-1 font-semibold text-xs border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-300">
                        <Inbox className="h-3.5 w-3.5" />
                        {items.length} {t('inventory.mrfSection.items')}
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
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs bg-gray-50/50 p-4 rounded-xl dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                        <div>
                            <span className="block font-medium text-gray-400">{t('inventory.mrfSection.receivedBy')}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block flex items-center gap-1">
                                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                                {form.receivedBy ? form.receivedBy.name : '—'}
                            </span>
                        </div>

                        <div>
                            <span className="block font-medium text-gray-400">{t('inventory.mrfSection.approvedBy')}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                                {form.approvedBy ? form.approvedBy.name : '—'}
                            </span>
                        </div>

                        <div>
                            <span className="block font-medium text-gray-400">{t('inventory.mrfSection.reviewedBy')}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                                {form.reviewedBy ? form.reviewedBy.name : '—'}
                            </span>
                        </div>

                        <div>
                            <span className="block font-medium text-gray-400">{t('inventory.mrfSection.remarks')}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block italic truncate">
                                {form.remarks || '—'}
                            </span>
                        </div>
                    </div>

                    {/* Received Items Table */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Layers className="h-4 w-4 text-emerald-600" />
                            {t('inventory.mrfSection.items')}
                        </h4>

                        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                            <table className="w-full text-left text-sm rtl:text-right">
                                <thead>
                                    <tr className="bg-gray-100/70 dark:bg-gray-800 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 dark:border-gray-800">
                                        <th className="p-3">#</th>
                                        <th className="p-3">{t('inventory.mrfSection.itemCode')}</th>
                                        <th className="p-3">{t('inventory.mrfSection.materialDescription')}</th>
                                        <th className="p-3">{t('inventory.mrfSection.partSerialNumber')}</th>
                                        <th className="p-3 text-center text-emerald-600 dark:text-emerald-400">{t('inventory.mrfSection.quantityReceived')}</th>
                                        <th className="p-3">{t('inventory.mrfSection.binLocation')}</th>
                                        <th className="p-3">{t('inventory.mrfSection.invoiceNo')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                                            <td className="p-3 font-mono text-xs text-gray-400">#{item.serial_number || idx + 1}</td>
                                            <td className="p-3 font-mono font-bold text-gray-900 dark:text-white">
                                                {item.item_code || '—'}
                                            </td>
                                            <td className="p-3 font-semibold text-gray-900 dark:text-white">
                                                {item.material_description}
                                            </td>
                                            <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-300">
                                                {item.part_serial_number || '—'}
                                            </td>
                                            <td className="p-3 text-center font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                                                +{item.quantity} <span className="text-xs font-normal">{item.unit}</span>
                                            </td>
                                            <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-300">
                                                {item.bin_location || '—'}
                                            </td>
                                            <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-300">
                                                {item.invoice_no || item.sto_pro_no || '—'}
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
