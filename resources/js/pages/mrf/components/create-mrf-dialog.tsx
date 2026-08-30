import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import { PackageCheck, Plus, Trash2 } from 'lucide-react';
import { CreateMRFDialogProps, FormLineItem } from '../types';

export function CreateMRFDialog({ open, onClose, stations = [], users = [] }: CreateMRFDialogProps) {
    const { t } = useTranslation();

    // Form header state
    const [formNumber, setFormNumber] = useState('');
    const [stationId, setStationId] = useState('');
    const [location, setLocation] = useState('');
    const [fromPlant, setFromPlant] = useState('');
    const [storeLocation, setStoreLocation] = useState('');
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const [receivedBy, setReceivedBy] = useState('');
    const [approvedBy, setApprovedBy] = useState('');
    const [reviewedBy, setReviewedBy] = useState('');
    const [requestedBy, setRequestedBy] = useState('');
    const [remarks, setRemarks] = useState('');

    // Form line items
    const [lineItems, setLineItems] = useState<FormLineItem[]>([
        {
            inventory_item_id: '',
            item_code: '',
            material_description: '',
            unit: '',
            current_stock: 0,
            quantity: 1,
            part_serial_number: '',
            valuation_type: '',
            bin_location: '',
            sto_pro_no: '',
            invoice_no: '',
        },
    ]);

    const [submitting, setSubmitting] = useState(false);

    // Derived inventory items for selected station
    const selectedStation = stations.find((s) => s.id.toString() === stationId);
    const stationInventoryItems = selectedStation?.inventory?.items || [];

    const handleAddLineItem = () => {
        setLineItems([
            ...lineItems,
            {
                inventory_item_id: '',
                item_code: '',
                material_description: '',
                unit: '',
                current_stock: 0,
                quantity: 1,
                part_serial_number: '',
                valuation_type: '',
                bin_location: '',
                sto_pro_no: '',
                invoice_no: '',
            },
        ]);
    };

    const handleRemoveLineItem = (index: number) => {
        setLineItems(lineItems.filter((_, i) => i !== index));
    };

    const handleSelectItem = (index: number, itemIdStr: string) => {
        const item = stationInventoryItems.find((inv) => inv.id.toString() === itemIdStr);
        if (!item) return;

        const updated = [...lineItems];
        updated[index] = {
            ...updated[index],
            inventory_item_id: itemIdStr,
            item_code: item.code || '',
            material_description: item.name,
            unit: item.unit || 'piece',
            current_stock: item.quantity || 0,
        };

        setLineItems(updated);
    };

    const handleQuantityChange = (index: number, qtyVal: string) => {
        const qty = parseFloat(qtyVal) || 0;
        const updated = [...lineItems];
        updated[index] = {
            ...updated[index],
            quantity: qty,
        };
        setLineItems(updated);
    };

    const handleFieldChange = (index: number, field: keyof FormLineItem, value: string) => {
        const updated = [...lineItems];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setLineItems(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!stationId) {
            toast.error(t('validation.required') || 'Please select station');
            return;
        }

        const validItems = lineItems.filter((li) => li.inventory_item_id && li.quantity > 0);
        if (validItems.length === 0) {
            toast.error(t('inventory.mrfSection.noForms') || 'Please add at least one received material item');
            return;
        }

        setSubmitting(true);

        const payload = {
            form_number: formNumber || undefined,
            station_id: stationId,
            location: location || undefined,
            from_plant: fromPlant || undefined,
            store_location: storeLocation || undefined,
            from_date: fromDate,
            to_date: toDate,
            received_by: receivedBy || undefined,
            approved_by: approvedBy || undefined,
            reviewed_by: reviewedBy || undefined,
            requested_by: requestedBy || undefined,
            remarks: remarks || undefined,
            items: validItems.map((li) => ({
                inventory_item_id: Number(li.inventory_item_id),
                quantity: li.quantity,
                part_serial_number: li.part_serial_number || undefined,
                valuation_type: li.valuation_type || undefined,
                bin_location: li.bin_location || undefined,
                sto_pro_no: li.sto_pro_no || undefined,
                invoice_no: li.invoice_no || undefined,
            })),
        };

        router.post('/mrf', payload, {
            onSuccess: () => {
                toast.success(t('inventory.mrfSection.createdSuccess') || 'Material Receiving Form created successfully');
                onClose();
            },
            onError: (err) => {
                console.error(err);
                toast.error(t('common.error') || 'Error creating form');
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <PackageCheck className="h-6 w-6 text-emerald-600" />
                        {t('inventory.mrfSection.create')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('inventory.mrfSection.subtitle')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Header Controls Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {/* Station Select */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="station_id" className="text-sm font-medium">
                                {t('inventory.mrfSection.station')} <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={stationId}
                                onValueChange={(val) => {
                                    setStationId(val);
                                    setLineItems([
                                        {
                                            inventory_item_id: '',
                                            item_code: '',
                                            material_description: '',
                                            unit: '',
                                            current_stock: 0,
                                            quantity: 1,
                                            part_serial_number: '',
                                            valuation_type: '',
                                            bin_location: '',
                                            sto_pro_no: '',
                                            invoice_no: '',
                                        },
                                    ]);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('inventory.mrfSection.selectStation')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {stations.map((st) => (
                                        <SelectItem key={st.id} value={st.id.toString()}>
                                            {st.name} ({st.code}) &mdash; {st.inventory?.items?.length || 0} Stock Items
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Form Number */}
                        <div className="space-y-1.5">
                            <Label htmlFor="form_number" className="text-sm font-medium">
                                {t('inventory.mrfSection.formNumber')}
                            </Label>
                            <Input
                                id="form_number"
                                value={formNumber}
                                onChange={(e) => setFormNumber(e.target.value)}
                                placeholder={t('inventory.mrfSection.formNumberPlaceholder')}
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-sm font-medium">
                                {t('inventory.mrfSection.location')}
                            </Label>
                            <Input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Plant / Station Location"
                            />
                        </div>

                        {/* From Plant */}
                        <div className="space-y-1.5">
                            <Label htmlFor="from_plant" className="text-sm font-medium">
                                {t('inventory.mrfSection.fromPlant')}
                            </Label>
                            <Input
                                id="from_plant"
                                value={fromPlant}
                                onChange={(e) => setFromPlant(e.target.value)}
                                placeholder="Supplier / Origin Plant"
                            />
                        </div>

                        {/* Store Location */}
                        <div className="space-y-1.5">
                            <Label htmlFor="store_location" className="text-sm font-medium">
                                {t('inventory.mrfSection.storeLocation')}
                            </Label>
                            <Input
                                id="store_location"
                                value={storeLocation}
                                onChange={(e) => setStoreLocation(e.target.value)}
                                placeholder="Storage Bay / Room"
                            />
                        </div>

                        {/* From Date */}
                        <div className="space-y-1.5">
                            <Label htmlFor="from_date" className="text-sm font-medium">
                                {t('inventory.mrfSection.fromDate')}
                            </Label>
                            <Input
                                id="from_date"
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>

                        {/* To Date */}
                        <div className="space-y-1.5">
                            <Label htmlFor="to_date" className="text-sm font-medium">
                                {t('inventory.mrfSection.toDate')}
                            </Label>
                            <Input
                                id="to_date"
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>

                        {/* Received By */}
                        <div className="space-y-1.5">
                            <Label htmlFor="received_by" className="text-sm font-medium">
                                {t('inventory.mrfSection.receivedBy')}
                            </Label>
                            <Select value={receivedBy} onValueChange={setReceivedBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Receiver" />
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

                        {/* Approved By */}
                        <div className="space-y-1.5">
                            <Label htmlFor="approved_by" className="text-sm font-medium">
                                {t('inventory.mrfSection.approvedBy')}
                            </Label>
                            <Select value={approvedBy} onValueChange={setApprovedBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Approver" />
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

                        {/* Reviewed By */}
                        <div className="space-y-1.5">
                            <Label htmlFor="reviewed_by" className="text-sm font-medium">
                                {t('inventory.mrfSection.reviewedBy')}
                            </Label>
                            <Select value={reviewedBy} onValueChange={setReviewedBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Reviewer" />
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

                        {/* Requested By */}
                        <div className="space-y-1.5">
                            <Label htmlFor="requested_by" className="text-sm font-medium">
                                {t('inventory.mrfSection.requestedBy')}
                            </Label>
                            <Select value={requestedBy} onValueChange={setRequestedBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Requestor" />
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

                    {/* Remarks Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="remarks" className="text-sm font-medium">
                            {t('inventory.mrfSection.remarks')}
                        </Label>
                        <Textarea
                            id="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Additional receiving notes or vendor details..."
                            rows={2}
                        />
                    </div>

                    {/* Line Items Table */}
                    <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                                    {t('inventory.mrfSection.items')} <span className="text-red-500">*</span>
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Add items received into station inventory
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddLineItem}
                                disabled={!stationId}
                                className="flex items-center gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
                            >
                                <Plus className="h-4 w-4" />
                                {t('inventory.mrfSection.addItem')}
                            </Button>
                        </div>

                        {!stationId ? (
                            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
                                Please select a station above to browse and add inventory items.
                            </div>
                        ) : lineItems.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
                                No items added. Click &quot;Add Item&quot; to begin.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lineItems.map((li, idx) => (
                                    <div
                                        key={idx}
                                        className="relative grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50 sm:grid-cols-12 items-end"
                                    >
                                        {/* Material Selection */}
                                        <div className="space-y-1 sm:col-span-4">
                                            <Label className="text-xs text-gray-500">
                                                Select Item #{idx + 1}
                                            </Label>
                                            <Select
                                                value={li.inventory_item_id}
                                                onValueChange={(val) => handleSelectItem(idx, val)}
                                            >
                                                <SelectTrigger className="bg-white dark:bg-gray-800">
                                                    <SelectValue placeholder="Choose Material" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {stationInventoryItems.map((inv) => (
                                                        <SelectItem key={inv.id} value={inv.id.toString()}>
                                                            {inv.name} {inv.code ? `(${inv.code})` : ''} &mdash; Current Stock: {inv.quantity} {inv.unit}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Quantity Received */}
                                        <div className="space-y-1 sm:col-span-2">
                                            <Label className="text-xs text-gray-500">
                                                {t('inventory.mrfSection.quantityReceived')}
                                            </Label>
                                            <Input
                                                type="number"
                                                step="any"
                                                min="0.001"
                                                value={li.quantity}
                                                onChange={(e) => handleQuantityChange(idx, e.target.value)}
                                                className="bg-white dark:bg-gray-800 font-mono font-bold text-emerald-600"
                                            />
                                        </div>

                                        {/* Part Serial Number */}
                                        <div className="space-y-1 sm:col-span-2">
                                            <Label className="text-xs text-gray-500">
                                                Part S/N
                                            </Label>
                                            <Input
                                                value={li.part_serial_number}
                                                onChange={(e) => handleFieldChange(idx, 'part_serial_number', e.target.value)}
                                                placeholder="Part Serial #"
                                                className="bg-white dark:bg-gray-800 text-xs font-mono"
                                            />
                                        </div>

                                        {/* Bin Location */}
                                        <div className="space-y-1 sm:col-span-3">
                                            <Label className="text-xs text-gray-500">
                                                {t('inventory.mrfSection.binLocation')}
                                            </Label>
                                            <Input
                                                value={li.bin_location}
                                                onChange={(e) => handleFieldChange(idx, 'bin_location', e.target.value)}
                                                placeholder="Bin / Shelf Location"
                                                className="bg-white dark:bg-gray-800 text-xs font-mono"
                                            />
                                        </div>

                                        {/* Remove Button */}
                                        <div className="flex justify-end sm:col-span-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveLineItem(idx)}
                                                className="text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dialog Actions */}
                    <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting || !stationId}
                            className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                        >
                            {submitting ? t('common.loading') : t('inventory.mrfSection.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
