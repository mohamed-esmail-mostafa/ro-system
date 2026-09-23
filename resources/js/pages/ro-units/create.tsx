
import { DashboardLayout } from '../dashboard/components/DashboardLayout'
// import  DashboardLayout  from '@/layouts/dashboard-layout'
import PageHeader from '@/components/shared/page-header'
import { Droplets } from 'lucide-react'
import useImport from '@/hooks/use-import'
import { Button } from '@/components/ui/button'
import { Link, router } from '@inertiajs/react'
import useComapny from '@/hooks/use-comapny'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import {
  Cpu,
  Wrench,
  Zap,
  Filter as FilterIcon,
  Gauge,
  Layers,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Station } from '@/types/ro'
import BackBtn from '@/components/shared/back-btn'
import Section from '@/components/shared/section'
import SectionHeader from '@/components/shared/section-header'

export default function create_ro_unit_page({ stations }: { stations: Station[] }) {
  const { t } = useImport()
  const { company } = useComapny();


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      station_id: '',
      name: '',
      code: '',
      capacity: '',
      serial_number: '',
      manufacturer: '',
      description: '',

      // Technical Specs (New Columns)
      pressure_vessels: '',
      membranes_per_vessel: '',
      total_membranes: '',
      membrane_model: '',
      hpp_model: '',
      hpp_brand: '',
      hpp_power_kw: '',
      feed_pump_model: '',
      chemical_dosing_model: '',
      sand_filters: '',
      carbon_filters: '',
      cartridge_filters: '',
      cartridge_size: '',
      design_flow: '',
      recovery_rate: '',
      design_pressure: '',
      plc_model: '',
      vfd_model: '',
      is_active: true,
    },
    validationSchema: Yup.object({
      station_id: Yup.string().required(t('validation.required')),
      name: Yup.string().required(t('validation.required')),
      code: Yup.string().nullable(),
      capacity: Yup.number().nullable().min(0),
      serial_number: Yup.string().nullable(),
      manufacturer: Yup.string().nullable(),
      description: Yup.string().nullable(),

      pressure_vessels: Yup.number().nullable().min(0),
      membranes_per_vessel: Yup.number().nullable().min(0),
      total_membranes: Yup.number().nullable().min(0),
      membrane_model: Yup.string().nullable(),
      hpp_model: Yup.string().nullable(),
      hpp_brand: Yup.string().nullable(),
      hpp_power_kw: Yup.number().nullable().min(0),
      feed_pump_model: Yup.string().nullable(),
      chemical_dosing_model: Yup.string().nullable(),
      sand_filters: Yup.number().nullable().min(0),
      carbon_filters: Yup.number().nullable().min(0),
      cartridge_filters: Yup.number().nullable().min(0),
      cartridge_size: Yup.string().nullable(),
      design_flow: Yup.number().nullable().min(0),
      recovery_rate: Yup.number().nullable().min(0),
      design_pressure: Yup.number().nullable().min(0),
      plc_model: Yup.string().nullable(),
      vfd_model: Yup.string().nullable(),
      is_active: Yup.boolean(),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const payload = {
        ...values,
        station_id: Number(values.station_id),
        capacity: values.capacity ? Number(values.capacity) : null,
        pressure_vessels: values.pressure_vessels !== '' ? Number(values.pressure_vessels) : null,
        membranes_per_vessel: values.membranes_per_vessel !== '' ? Number(values.membranes_per_vessel) : null,
        total_membranes: values.total_membranes !== '' ? Number(values.total_membranes) : null,
        hpp_power_kw: values.hpp_power_kw !== '' ? Number(values.hpp_power_kw) : null,
        sand_filters: values.sand_filters !== '' ? Number(values.sand_filters) : null,
        carbon_filters: values.carbon_filters !== '' ? Number(values.carbon_filters) : null,
        cartridge_filters: values.cartridge_filters !== '' ? Number(values.cartridge_filters) : null,
        design_flow: values.design_flow !== '' ? Number(values.design_flow) : null,
        recovery_rate: values.recovery_rate !== '' ? Number(values.recovery_rate) : null,
        design_pressure: values.design_pressure !== '' ? Number(values.design_pressure) : null,
        is_active: Boolean(values.is_active),
      };

      router.post('/ro-units/store', payload, {
        onSuccess: () => {
          toast.success(t('ro-units.createSuccess'));
          resetForm();

        },
        onError: () => toast.error(t('common.error')),
        onFinish: () => setSubmitting(false),
      });
    },
  });


  const formFields = [
    {
      sectionTitle: t('ro-units.sections.basicInfo'),
      fields: [
        {
          label: t('ro-units.fields.station'),
          name: "name",
          value: "value",
          onChange: formik.handleChange,
          placeholder: "placeholder"
        }
      ]
    }
  ]
  return (
    <DashboardLayout>
      <PageHeader
        icon={<Droplets className="h-5 w-5 text-white" />}
        title={t('ro-units.title')}
        subtitle={` ${company?.name} - ${t('ro-units.subtitle')} `}

      >
        <BackBtn />
      </PageHeader>

      <div className=''>
        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-6 py-2">
          {/* SECTION 1: BASIC INFORMATION (OLD COLUMNS) */}
          <Section>
            <SectionHeader title={t('ro-units.sections.basicInfo')} />
            <div className="space-y-4 p-3">

              {/* Station Selector */}
              <div className="space-y-1 ">
                <Label>{t('ro-units.fields.station')} <span className="text-red-500">*</span></Label>
                <Select
                  value={formik.values.station_id}
                  onValueChange={(val) => formik.setFieldValue('station_id', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('ro-units.fields.station')} />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name} ({s.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={formik.touched.station_id ? formik.errors.station_id : undefined} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>{t('ro-units.fields.name')} <span className="text-red-500">*</span></Label>
                  <Input
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('ro-units.fields.name')}
                  />
                  <InputError message={formik.touched.name ? formik.errors.name : undefined} />
                </div>

                <div className="space-y-1">
                  <Label>{t('ro-units.fields.capacity')}</Label>
                  <Input
                    name="capacity"
                    type="number"
                    value={formik.values.capacity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min={0}
                    step="0.01"
                    placeholder="e.g. 50.0"
                  />
                  <InputError message={formik.touched.capacity ? (formik.errors.capacity as string) : undefined} />
                </div>

                <div className="space-y-1">
                  <Label>{t('ro-units.fields.manufacturer')}</Label>
                  <Input
                    name="manufacturer"
                    value={formik.values.manufacturer}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. AquaTech"
                  />
                </div>

                <div className="space-y-1">
                  <Label>{t('ro-units.fields.serialNumber')}</Label>
                  <Input
                    name="serial_number"
                    value={formik.values.serial_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. SN-8839201"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>{t('ro-units.fields.description')}</Label>
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="min-h-[70px]"
                  placeholder={t('ro-units.fields.description')}
                />
              </div>
            </div>
          </Section>


          {/* VISUAL SEPARATOR BETWEEN OLD AND NEW COLUMNS */}
          {/* <div className="relative my-6">
         
            <div className="relative flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-sm dark:border-primary dark:bg-primary dark:text-blue-300">
                <Cpu className="h-4 w-4 text-primary dark:text-primary" />
                {t('ro-units.sections.techSpecs')}
              </span>
            </div>
          </div> */}

          {/* SECTION 2: TECHNICAL SPECIFICATIONS (NEW COLUMNS) */}

          {/* 2.1 Membranes & Pressure Vessels */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-primary">
              <Layers className="h-4 w-4" />
              <span>{t('ro-units.sections.membranes')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.pressureVessels')}</Label>
                <Input
                  name="pressure_vessels"
                  type="number"
                  min={0}
                  value={formik.values.pressure_vessels}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 6"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.membranesPerVessel')}</Label>
                <Input
                  name="membranes_per_vessel"
                  type="number"
                  min={0}
                  value={formik.values.membranes_per_vessel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 6"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.totalMembranes')}</Label>
                <Input
                  name="total_membranes"
                  type="number"
                  min={0}
                  value={formik.values.total_membranes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 36"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{t('ro-units.fields.membraneModel')}</Label>
              <Input
                name="membrane_model"
                value={formik.values.membrane_model}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Filmtec BW30-400"
              />
            </div>
          </div>

          <Section>
            <SectionHeader title={t('ro-units.sections.membranes')} />
            <div className='p-3'>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">{t('ro-units.fields.pressureVessels')}</Label>
                  <Input
                    name="pressure_vessels"
                    type="number"
                    min={0}
                    value={formik.values.pressure_vessels}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. 6"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">{t('ro-units.fields.membranesPerVessel')}</Label>
                  <Input
                    name="membranes_per_vessel"
                    type="number"
                    min={0}
                    value={formik.values.membranes_per_vessel}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. 6"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">{t('ro-units.fields.totalMembranes')}</Label>
                  <Input
                    name="total_membranes"
                    type="number"
                    min={0}
                    value={formik.values.total_membranes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. 36"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.membraneModel')}</Label>
                <Input
                  name="membrane_model"
                  value={formik.values.membrane_model}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Filmtec BW30-400"
                />
              </div>
            </div>
          </Section>

          {/* 2.2 Pumps & Power Equipment */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-primary">
              <Zap className="h-4 w-4" />
              <span>{t('ro-units.sections.pumpsAndPower')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.feedPumpModel')}</Label>
                <Input
                  name="feed_pump_model"
                  value={formik.values.feed_pump_model}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Grundfos CR 32-3"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.hppModel')}</Label>
                <Input
                  name="hpp_model"
                  value={formik.values.hpp_model}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Grundfos BM 150"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.hppBrand')}</Label>
                <Input
                  name="hpp_brand"
                  value={formik.values.hpp_brand}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Grundfos"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.hppPowerKw')}</Label>
                <Input
                  name="hpp_power_kw"
                  type="number"
                  step="0.01"
                  min={0}
                  value={formik.values.hpp_power_kw}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 45.0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{t('ro-units.fields.chemicalDosingModel')}</Label>
              <Input
                name="chemical_dosing_model"
                value={formik.values.chemical_dosing_model}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. SEKO Tekna EVO"
              />
            </div>
          </div>

          {/* 2.3 Pre-treatment & Filters */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:primary">
              <FilterIcon className="h-4 w-4" />
              <span>{t('ro-units.sections.filters')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.sandFilters')}</Label>
                <Input
                  name="sand_filters"
                  type="number"
                  min={0}
                  value={formik.values.sand_filters}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 2"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.carbonFilters')}</Label>
                <Input
                  name="carbon_filters"
                  type="number"
                  min={0}
                  value={formik.values.carbon_filters}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 2"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.cartridgeFilters')}</Label>
                <Input
                  name="cartridge_filters"
                  type="number"
                  min={0}
                  value={formik.values.cartridge_filters}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{t('ro-units.fields.cartridgeSize')}</Label>
              <Input
                name="cartridge_size"
                value={formik.values.cartridge_size}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='e.g. 5 Micron 40"'
              />
            </div>
          </div>

          {/* 2.4 Design Performance Metrics */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-primary">
              <Gauge className="h-4 w-4" />
              <span>{t('ro-units.sections.performance')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.designFlow')}</Label>
                <Input
                  name="design_flow"
                  type="number"
                  step="0.01"
                  min={0}
                  value={formik.values.design_flow}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 25.0"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.recoveryRate')}</Label>
                <Input
                  name="recovery_rate"
                  type="number"
                  step="0.01"
                  min={0}
                  max={100}
                  value={formik.values.recovery_rate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 75.0"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.designPressure')}</Label>
                <Input
                  name="design_pressure"
                  type="number"
                  step="0.01"
                  min={0}
                  value={formik.values.design_pressure}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 15.5"
                />
              </div>
            </div>
          </div>

          {/* 2.5 Control & Automation */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-primary">
              <Wrench className="h-4 w-4" />
              <span>{t('ro-units.sections.control')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.plcModel')}</Label>
                <Input
                  name="plc_model"
                  value={formik.values.plc_model}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Siemens S7-1200"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{t('ro-units.fields.vfdModel')}</Label>
                <Input
                  name="vfd_model"
                  value={formik.values.vfd_model}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Danfoss FC-302"
                />
              </div>
            </div>
          </div>

          {/* 2.6 Active Status */}
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="is_active"
              checked={formik.values.is_active}
              onCheckedChange={(checked) => formik.setFieldValue('is_active', Boolean(checked))}
            />
            <Label htmlFor="is_active" className="cursor-pointer text-sm font-medium">
              {t('ro-units.fields.isActive')}
            </Label>
          </div>

          <Button type="submit" disabled={formik.isSubmitting} >
            {formik.isSubmitting ? t('common.loading') : t('common.save')}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  )
}
