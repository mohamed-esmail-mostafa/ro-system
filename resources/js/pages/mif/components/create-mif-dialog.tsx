import { router } from '@inertiajs/react';
import { useFormik } from 'formik';
import { FileSpreadsheet, Package, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { CreateMIFDialogProps, CreateMIFFormValues, FormLineItem } from '../types';

const initialLineItem: FormLineItem = {
    inventory_item_id: '',
    item_code: '',
    material_description: '',
    unit: '',
    balance: 0,
    quantity: 1,
    balance_after: 0,
    pm_order: '',
    valuation_type: '',
};

export default function CreateMIFDialog({
    open,
    onClose,
    stations = [],
    users = [],
}: CreateMIFDialogProps) {
    const { t } = useTranslation();

    const formik = useFormik<CreateMIFFormValues>({
        enableReinitialize: true,
        initialValues: {
            form_number: '',
            station_id: '',
            from_location: '',
            store_location: '',
            from_date: new Date().toISOString().split('T')[0],
            to_date: new Date().toISOString().split('T')[0],
            is_transfer: false,
            is_maintenance_direct_issue: true,
            issued_by: '',
            recieved_by: '',
            remarks: '',
            items: [{ ...initialLineItem }],
        },
        validationSchema: Yup.object({
            station_id: Yup.string().required(t('validation.required') || 'Station is required'),
            items: Yup.array()
                .of(
                    Yup.object({
                        inventory_item_id: Yup.string().required(t('validation.required') || 'Item is required'),
                        quantity: Yup.number()
                            .typeError(t('validation.numeric') || 'Must be a number')
                            .positive(t('validation.positive') || 'Must be greater than 0')
                            .required(t('validation.required') || 'Quantity is required'),
                    })
                )
                .min(1, t('inventory.mifSection.noItems') || 'Please add at least one material item'),
        }),
        onSubmit(values, { resetForm, setSubmitting }) {
            const validItems = values.items.filter((li) => li.inventory_item_id && li.quantity > 0);

            if (validItems.length === 0) {
                toast.error(t('inventory.mifSection.noItems') || 'Please add at least one material item');
                setSubmitting(false);

                return;
            }

            const payload = {
                form_number: values.form_number || undefined,
                station_id: values.station_id,
                from_location: values.from_location || undefined,
                store_location: values.store_location || undefined,
                from_date: values.from_date,
                to_date: values.to_date,
                is_transfer: values.is_transfer,
                is_maintenance_direct_issue: values.is_maintenance_direct_issue,
                issued_by: values.issued_by || undefined,
                recieved_by: values.recieved_by || undefined,
                remarks: values.remarks || undefined,
                items: validItems.map((li) => ({
                    inventory_item_id: Number(li.inventory_item_id),
                    station_id: Number(values.station_id),
                    quantity: li.quantity,
                    pm_order: li.pm_order || undefined,
                    valuation_type: li.valuation_type || undefined,
                })),
            };

            router.post('/mif', payload, {
                onSuccess: () => {
                    toast.success(t('inventory.mifSection.createdSuccess') || 'MIF created successfully');
                    resetForm();
                    onClose();
                },
                onError: (err) => {
                    console.error('Error creating MIF:', err);
                    toast.error(t('common.error') || 'Failed to create MIF');
                },
                onFinish: () => setSubmitting(false),
            });
        },
    });

    const selectedStation = stations.find((s) => s.id.toString() === formik.values.station_id);
    const stationInventoryItems = selectedStation?.inventory?.items || [];

    const handleAddLineItem = () => {
        formik.setFieldValue('items', [...formik.values.items, { ...initialLineItem }]);
    };

    const handleRemoveLineItem = (index: number) => {
        const updated = formik.values.items.filter((_, i) => i !== index);
        formik.setFieldValue('items', updated);
    };

    const handleSelectItem = (index: number, itemIdStr: string) => {
        const item = stationInventoryItems.find((inv) => inv.id.toString() === itemIdStr);

        if (!item) {
            return;
        }

        const updated = [...formik.values.items];
        const qty = updated[index].quantity || 1;
        const currentBalance = item.quantity || 0;

        updated[index] = {
            ...updated[index],
            inventory_item_id: itemIdStr,
            item_code: item.code || '',
            material_description: item.name,
            unit: item.unit || 'piece',
            balance: currentBalance,
            quantity: qty,
            balance_after: Math.max(0, currentBalance - qty),
        };

        formik.setFieldValue('items', updated);
    };

    const handleQuantityChange = (index: number, qtyVal: string) => {
        const qty = parseFloat(qtyVal) || 0;
        const updated = [...formik.values.items];
        const currentBalance = updated[index].balance || 0;

        updated[index] = {
            ...updated[index],
            quantity: qty,
            balance_after: Math.max(0, currentBalance - qty),
        };

        formik.setFieldValue('items', updated);
    };

    const handleItemFieldChange = (index: number, field: keyof FormLineItem, val: string) => {
        const updated = [...formik.values.items];
        updated[index] = {
            ...updated[index],
            [field]: val,
        };
        formik.setFieldValue('items', updated);
    };

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <FileSpreadsheet className="h-6 w-6 text-teal-600" />
                        {t('inventory.mifSection.create')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('inventory.mifSection.subtitle')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-6 pt-2">
                    {/* Header Controls Grid */}
                    {/* grid grid-cols-1 gap-4 sm:grid-cols-3 */}
                    <div className="">
                        {/* Station Select */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="station_id" className="text-sm font-medium">
                                {t('inventory.mifSection.station')} <span className="text-red-500">*</span>
                            </Label>
                            <Select

                                value={formik.values.station_id}
                                onValueChange={(val) => {
                                    formik.setFieldValue('station_id', val);
                                    formik.setFieldValue('items', [{ ...initialLineItem }]);
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder={t('inventory.mifSection.selectStation')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {stations.map((st) => (
                                        <SelectItem key={st.id} value={st.id.toString()}>
                                            {st.name} ({st.code}) &mdash; {st.inventory?.items?.length || 0} Stock Items
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formik.touched.station_id && formik.errors.station_id && (
                                <InputError message={formik.errors.station_id} />
                            )}
                        </div>



                        {/* From Location */}
                        {/* <div className="space-y-1.5">
                            <Label htmlFor="from_location" className="text-sm font-medium">
                                {t('inventory.mifSection.fromLocation')}
                            </Label>
                            <Input
                                id="from_location"
                                name="from_location"
                                value={formik.values.from_location}
                                onChange={formik.handleChange}
                                placeholder="Main Warehouse"
                            />
                        </div> */}

                        {/* Store Location */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="store_location" className="text-sm font-medium">
                                {t('inventory.mifSection.storeLocation')}
                            </Label>
                            <Input
                                id="store_location"
                                name="store_location"
                                value={formik.values.store_location}
                                onChange={formik.handleChange}
                                placeholder={t('inventory.mifSection.storeLocation')}
                            />
                        </div>

                        {/* Issued By */}
                        {/* <div className="space-y-1.5">
                            <Label htmlFor="issued_by" className="text-sm font-medium">
                                {t('inventory.mifSection.issuedBy')}
                            </Label>
                            <Select
                                value={formik.values.issued_by}
                                onValueChange={(val) => formik.setFieldValue('issued_by', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('inventory.mifSection.issuedBy')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={u.id.toString()}>
                                            {u.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div> */}

                        {/* Dates */}
                        <div>
                            <div className="space-y-1.5">
                                <Label htmlFor="from_date" className="text-sm font-medium">
                                    {t('inventory.mifSection.fromDate')}
                                </Label>
                                <Input
                                    id="from_date"
                                    name="from_date"
                                    type="date"
                                    value={formik.values.from_date}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="to_date" className="text-sm font-medium">
                                    {t('inventory.mifSection.toDate')}
                                </Label>
                                <Input
                                    id="to_date"
                                    name="to_date"
                                    type="date"
                                    value={formik.values.to_date}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>


                        {/* Received By */}
                        <div className="space-y-1.5">
                            <Label htmlFor="recieved_by" className="text-sm font-medium">
                                {t('inventory.mifSection.recievedBy')}
                            </Label>
                            <Select
                                value={formik.values.recieved_by}
                                onValueChange={(val) => formik.setFieldValue('recieved_by', val)}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder={t('inventory.mifSection.recievedBy')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={u.id.toString()}>
                                            {u.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_maintenance_direct_issue"
                                checked={formik.values.is_maintenance_direct_issue}
                                onCheckedChange={(c) => formik.setFieldValue('is_maintenance_direct_issue', Boolean(c))}
                            />
                            <Label htmlFor="is_maintenance_direct_issue" className="cursor-pointer text-sm font-medium">
                                {t('inventory.mifSection.isMaintenanceDirectIssue')}
                            </Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_transfer"
                                checked={formik.values.is_transfer}
                                onCheckedChange={(c) => formik.setFieldValue('is_transfer', Boolean(c))}
                            />
                            <Label htmlFor="is_transfer" className="cursor-pointer text-sm font-medium">
                                {t('inventory.mifSection.isTransfer')}
                            </Label>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-1.5">
                        <Label htmlFor="remarks" className="text-sm font-medium">
                            {t('inventory.mifSection.remarks')}
                        </Label>
                        <Textarea
                            id="remarks"
                            name="remarks"
                            value={formik.values.remarks}
                            onChange={formik.handleChange}
                            rows={2}
                            placeholder={t('inventory.mifSection.remarks')}
                        />
                    </div>

                    {/* Dynamic Material Items Table */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Package className="h-4 w-4 text-teal-600" />
                                {t('inventory.mifSection.items')}
                            </h4>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleAddLineItem}
                                disabled={!formik.values.station_id}
                                className="flex items-center gap-1.5 text-teal-600 border-teal-200 hover:bg-teal-50"
                            >
                                <Plus className="h-4 w-4" />
                                {t('inventory.mifSection.addItem')}
                            </Button>
                        </div>

                        {!formik.values.station_id ? (
                            <div className="p-6 text-center border border-dashed rounded-xl text-sm text-gray-400">
                                {t('inventory.mifSection.selectStation')} 
                                {t('inventory.mifSection.view-stock')}
                                
                            </div>
                        ) : stationInventoryItems.length === 0 ? (
                            <div className="p-6 text-center border border-dashed rounded-xl text-sm text-amber-600 bg-amber-50/50">
                               
                                {t("inventory.mifSection.no-stock-items")}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {formik.values.items.map((li, idx) => {
                                    const itemTouched = formik.touched.items?.[idx];
                                    const itemError = formik.errors.items?.[idx];
                                    const hasError = typeof itemError === 'object' && itemError !== null;

                                    return (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 space-y-3"
                                        >
                                            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                                                {/* <span>Material Item #{idx + 1}</span> */}
                                                {formik.values.items.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleRemoveLineItem(idx)}
                                                        className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                                {/* Select Item */}
                                                <div className="sm:col-span-2 space-y-1">
                                                    <Label className="text-xs">{t('inventory.mifSection.selectInventoryItem')}</Label>
                                                    <Select
                                                        value={li.inventory_item_id}
                                                        onValueChange={(val) => handleSelectItem(idx, val)}
                                                    >
                                                        <SelectTrigger className="h-9 w-full text-xs">
                                                            <SelectValue placeholder={t('inventory.mifSection.selectInventoryItem')} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {stationInventoryItems.map((inv) => (
                                                                <SelectItem key={inv.id} value={inv.id.toString()}>
                                                                    {inv.name} ({inv.code || 'No Code'}) &mdash; Stock: {inv.quantity} {inv.unit}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {itemTouched?.inventory_item_id && hasError && (itemError as any).inventory_item_id && (
                                                        <InputError message={(itemError as any).inventory_item_id} />
                                                    )}
                                                </div>

                                                {/* PM Order */}
                                                <div className="space-y-1">
                                                    <Label className="text-xs">{t('inventory.mifSection.pmOrder')}</Label>
                                                    <Input
                                                        className="h-9 text-xs"
                                                        value={li.pm_order}
                                                        onChange={(e) => handleItemFieldChange(idx, 'pm_order', e.target.value)}
                                                        placeholder="PM-10293"
                                                    />
                                                </div>

                                                {/* Valuation Type */}
                                                <div className="space-y-1">
                                                    <Label className="text-xs">{t('inventory.mifSection.valuationType')}</Label>
                                                    <Input
                                                        className="h-9 text-xs"
                                                        value={li.valuation_type}
                                                        onChange={(e) => handleItemFieldChange(idx, 'valuation_type', e.target.value)}
                                                        placeholder="Standard / Spare"
                                                    />
                                                </div>
                                            </div>

                                            {/* Stock & Quantity row */}
                                            {li.inventory_item_id && (
                                                <div className="grid grid-cols-3 gap-3 pt-1 border-t border-gray-200/60 dark:border-gray-800 text-xs">
                                                    <div className="bg-white p-2.5 rounded-lg border dark:bg-gray-900">
                                                        <span className="text-gray-400 block">{t('inventory.mifSection.balance')}</span>
                                                        <span className="font-bold text-gray-900 dark:text-white font-mono">
                                                            {li.balance} {li.unit}
                                                        </span>
                                                    </div>

                                                    <div className="bg-white p-2.5 rounded-lg border dark:bg-gray-900">
                                                        <Label className="text-teal-600 font-bold block mb-1">
                                                            {t('inventory.mifSection.quantity')}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            step="0.001"
                                                            min="0.001"
                                                            max={li.balance}
                                                            className="h-7 font-mono font-bold text-teal-600"
                                                            value={li.quantity}
                                                            onChange={(e) => handleQuantityChange(idx, e.target.value)}
                                                        />
                                                        {itemTouched?.quantity && hasError && (itemError as any).quantity && (
                                                            <InputError message={(itemError as any).quantity} />
                                                        )}
                                                    </div>

                                                    <div className="bg-white p-2.5 rounded-lg border dark:bg-gray-900">
                                                        <span className="text-gray-400 block">{t('inventory.mifSection.balanceAfter')}</span>
                                                        <span className="font-bold text-gray-900 dark:text-white font-mono">
                                                            {li.balance_after} {li.unit}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="bg-teal-600 hover:bg-teal-700 font-bold"
                        >
                            {formik.isSubmitting ? t('common.loading') : t('inventory.mifSection.submit')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
