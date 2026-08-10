import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useImport from '@/hooks/use-import'
import { RoUnit } from '@/types/ro';
import { ClipboardList, Lightbulb } from 'lucide-react';
import React from 'react'

export default function ReportActionRecommendation({ unit, formik }: { unit: RoUnit, formik: any }) {
    const { t } = useImport();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-2">
                <Label
                    htmlFor={`actions_${unit.id}`}
                   
                >
                    <ClipboardList className="h-4 w-4 text-teal-500" />
                    {t('reports.actions', 'Actions Taken / الإجراءات المتخذة')}
                </Label>
                <Textarea
                    id={`actions_${unit.id}`}
                    name="actions"
                    value={formik.values.actions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('reports.actionsPlaceholder', 'Describe any actions taken today...')}
                    rows={3}
                    
                />
                {formik.touched.actions && formik.errors.actions && (
                    <InputError message={formik.errors.actions as string} />
                )}
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor={`recommendations_${unit.id}`}
                   
                >
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    {t('reports.recommendations', 'Recommendations / التوصيات')}
                </Label>
                <Textarea
                    id={`recommendations_${unit.id}`}
                    name="recommendations"
                    value={formik.values.recommendations}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('reports.recommendationsPlaceholder', 'Add any recommendations or notes...')}
                    rows={3}
                // className="resize-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-900/50"
                />
                {formik.touched.recommendations && formik.errors.recommendations && (
                    // <p className="text-xs text-red-500 mt-1">
                    //     {formik.errors.recommendations as string}
                    // </p>
                    <InputError message={formik.errors.recommendations as string} />
                )}
            </div>
        </div>
    )
}
