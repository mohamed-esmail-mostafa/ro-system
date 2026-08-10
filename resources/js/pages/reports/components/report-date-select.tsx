import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input'
import useImport from '@/hooks/use-import'
import { RoUnit } from '@/types/ro';
import { CalendarDays } from 'lucide-react'
import React from 'react'

export default function ReportDateSelect({unit ,formik}:{unit:RoUnit,formik:any}) {
    const { t } = useImport();
     const getTodayDate = () => new Date().toISOString().split('T')[0]
    return (
        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 border border-teal-100 dark:border-teal-800/40">
            <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-semibold text-teal-800 dark:text-teal-300 text-sm uppercase tracking-wide">
                    {t('reports.reportDate', 'Report Date / تاريخ التقرير')}
                </h3>
            </div>
            <div className="max-w-xs">
                <Input
                    id={`report_date_${unit.id}`}
                    name="report_date"
                    type="date"
                    max={getTodayDate()}
                    value={formik.values.report_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-900/50 bg-white"
                />
                {/* {formik.touched.report_date && formik.errors.report_date && (
                    <p className="text-xs text-red-500 mt-1">{formik.errors.report_date as string}</p>
                )} */}
                <InputError message={formik.errors.report_date as string} />
            </div>
        </div>
    )
}
