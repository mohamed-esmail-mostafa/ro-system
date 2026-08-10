import { useFormik } from 'formik'
import * as Yup from 'yup'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, NotepadTextDashed, CalendarDays, Lightbulb, ClipboardList, ChevronRight,  CheckCircle2} from 'lucide-react'
import toast from 'react-hot-toast'
import useImport from '@/hooks/use-import'
import { RoUnit } from '@/types/ro'
import ReportDateSelect from './report-date-select'
import NoParameterFound from './no-parameter-found'
import ReportActionRecommendation from './report-action-recommendation'
import InputError from '@/components/input-error'






interface DailyReportFormProps {
    unit: RoUnit    
}

type DailyReportFormValues = {
    ro_unit_id: number
    report_date: string
    actions: string
    recommendations: string
    [key: string]: string | number
}

export function DailyReportForm({ unit }: DailyReportFormProps) {

    const { t } = useImport();
    const initialValues: Record<string, string> = {}
    // unit.ro_unit_reading_categories?.forEach((category) => {
    //     category.parameters?.forEach((param) => {
    //         initialValues[`prev_${param.id}`] = ''
    //         initialValues[`curr_${param.id}`] = ''
    //     })
    // })

    unit.ro_unit_reading_categories?.forEach((category) => {
    category.parameters?.forEach((param:any) => {
        initialValues[`prev_${param.id}`] =
            param.previous_value !== null &&
            param.previous_value !== undefined
                ? String(param.previous_value)
                : ''

        initialValues[`curr_${param.id}`] = ''
    })
})

    // Build Yup shape dynamically
    // const schemaShape: Record<string, Yup.StringSchema | Yup.DateSchema> = {
    //     report_date: Yup.string().required(t('reports.validation.dateRequired', 'Report date is required')),
    //     actions: Yup.string().nullable(),
    //     recommendations: Yup.string().nullable(),
    // }
    const schemaShape: Record<string, Yup.AnySchema> = {
    report_date: Yup.string().required(
        t('reports.validation.dateRequired', 'Report date is required')
    ),
    actions: Yup.string().nullable(),
    recommendations: Yup.string().nullable(),
}
    unit.ro_unit_reading_categories?.forEach((category) => {
        category.parameters?.forEach((item:any) => {
            const currKey = `curr_${item.id}`
            const prevKey = `prev_${item.id}`
            if (item.is_required) {
                schemaShape[currKey] = Yup.string()
                    .required(t('reports.validation.required', 'This field is required'))
                    .matches(/^-?\d*\.?\d*$/, t('reports.validation.numeric', 'Must be a number'))
            } else {
                schemaShape[currKey] = Yup.string()
                    .nullable()
                    .matches(/^-?\d*\.?\d*$/, t('reports.validation.numeric', 'Must be a number'))
            }
            schemaShape[prevKey] = Yup.string()
                .nullable()
                .matches(/^-?\d*\.?\d*$/, t('reports.validation.numeric', 'Must be a number'))
        })
    })

    const validationSchema = Yup.object(schemaShape)

    const formik = useFormik<DailyReportFormValues>({
        enableReinitialize: true,
        initialValues: {
            ro_unit_id: unit.id,
            report_date: new Date().toISOString().split('T')[0],
            actions: '',
            recommendations: '',
            ...initialValues,
        },
        validationSchema,
        onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
            // Build values array for backend
            const paramValues: Record<string, { previous_value: string | null; current_value: string | null; difference: string | null }> = {}

            unit.ro_unit_reading_categories?.forEach((category) => {
                category.parameters?.forEach((item:any) => {
                    const prev = values[`prev_${item.id}`] as string
                    const curr = values[`curr_${item.id}`] as string
                    const prevNum = parseFloat(prev)
                    const currNum = parseFloat(curr)
                    const diff = !isNaN(prevNum) && !isNaN(currNum) ? String((currNum - prevNum).toFixed(3)) : null

                    paramValues[item.id] = {
                        previous_value: prev || null,
                        current_value: curr || null,
                        difference: diff,
                    }
                })
            })

            const payload = {
                ro_unit_id: values.ro_unit_id,
                report_date: values.report_date,
                actions: values.actions || null,
                recommendations: values.recommendations || null,
                values: paramValues,
            }
 
            router.post('/reports', payload, {
               
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(t('reports.added_successfully'))
                    resetForm()
                },
                onError: (errors) => {
                    toast.error(t('common.error'))
                    setErrors(errors as any)
                },
                onFinish: () => setSubmitting(false),
            })
        },
    })

   

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-teal-600" />
                    {unit.name}
                    {unit.code && (
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                            {unit.code}
                        </span>
                    )}
                </h2>
            </div>

            {/* Report Date */}
           <ReportDateSelect unit={unit} formik={formik} />

            {/* Reading Categories */}
            <div className="space-y-5">
                {unit.ro_unit_reading_categories?.map((category:any) => (
                    <div
                        key={category.id}
                        className="rounded-xl border border-gray-200 dark:border-gray-700/60 overflow-hidden bg-gray-50/50 dark:bg-gray-800/30"
                    >
                        <div className="bg-gray-100/80 dark:bg-gray-800 px-5 py-3 border-b border-gray-200 dark:border-gray-700/60">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{category.category.name}</h3>
                        </div>

                        <div className="p-5">
                            {!category.parameters || category.parameters.length === 0 ? (
                                <NoParameterFound />
                            ) : (
                                <div className="space-y-4">
                                   
                                    {/* Parameter rows */}
                                    {category.parameters.map((param:any) => {
                                        const prevKey = `prev_${param.id}`
                                        const currKey = `curr_${param.id}`
                                        const prevVal = formik.values[prevKey] as string
                                        const currVal = formik.values[currKey] as string
                                        const prevNum = parseFloat(prevVal)
                                        const currNum = parseFloat(currVal)
                                        const diff =
                                            !isNaN(prevNum) && !isNaN(currNum)
                                                ? (currNum - prevNum).toFixed(2)
                                                : '—'
                                        const diffNum = parseFloat(diff)
                                        const isDiffPositive = diffNum > 0
                                        const isDiffNegative = diffNum < 0

                                        const currError =
                                            formik.touched[currKey] && formik.errors[currKey]
                                        const prevError =
                                            formik.touched[prevKey] && formik.errors[prevKey]

                                        return (
                                            <div key={param.id} className="grid grid-cols-1 md:grid-cols-12  gap-3 items-start">
                                                {/* Parameter name */}
                                                <div className="col-span-4 flex items-start gap-2 pt-2">
                                                    <ChevronRight className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                                    <div className='flex'>
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {param.name}
                                                        </span>
                                                        {param.is_required && (
                                                            <span className="ms-1 text-red-400 text-xs">*</span>
                                                        )}
                                                        {param.unit && (
                                                            <span className="block text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-medium w-fit mt-0.5">
                                                                {param.unit}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Previous value */}
                                                <div className="col-span-3">
                                                    <Label> {t('reports.previousValue', 'Previous / السابق')}</Label>
                                                    <Input
                                                        id={`prev_${param.id}_${unit.id}`}
                                                        name={prevKey}
                                                        type="number"
                                                        step="0.001"
                                                        readOnly
                                                        value={prevVal ?? ''}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="0.00"
                                                        className="text-center focus:ring-gray-400 focus:border-gray-400 dark:bg-gray-900/50 transition-all"
                                                    />
                                                    {prevError && (
                                                        <p className="text-xs text-red-500 mt-1">
                                                            {formik.errors[prevKey] as string}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Current value */}
                                                <div className="col-span-3">
                                                      <Label>   {t('reports.currentValue', 'Current / الحالي')}</Label>
                                                    <Input
                                                        id={`curr_${param.id}_${unit.id}`}
                                                        name={currKey}
                                                        type="number"
                                                        step="0.001"
                                                        value={currVal ?? ''}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="0.00"
                                                        className="text-center focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-900/50 transition-all"
                                                    />
                                                    {currError && (
                                                        <InputError message={formik.errors[currKey] as string} />
                                                    )}
                                                </div>

                                                {/* Difference (auto-calculated) */}
                                                <div className="col-span-2 flex items-center justify-center pt-2">
                                                    <span
                                                        className={`text-sm font-semibold tabular-nums px-2 py-0.5 rounded-md ${diff === '—'
                                                                ? 'text-gray-400 dark:text-gray-600'
                                                                : isDiffPositive
                                                                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                                                                    : isDiffNegative
                                                                        ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                                                                        : 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'
                                                            }`}
                                                    >
                                                        {diff === '—' ? '—' : isDiffPositive ? `+${diff}` : diff}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions & Recommendations */}
          <ReportActionRecommendation unit={unit} formik={formik} />

            {/* Submit */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 dark:text-gray-600">
                    {t('reports.submittedFor', 'Submitting report for')}: <strong>{unit.name}</strong>
                </p>
                <Button
                    type="submit"
                    disabled={formik.isSubmitting}
                    
                >
                    <CheckCircle2 className="h-4 w-4" />
                    {formik.isSubmitting
                        ? t('common.saving')
                        : t('reports.submit')}
                </Button>
            </div>
        </form>
    )
}
