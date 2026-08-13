// ─── MIF Domain Types ───────────────────────────────────────────────────────────

export interface InventoryItem {
    id: number;
    inventory_id: number;
    name: string;
    code?: string | null;
    type: string;
    unit: string;
    quantity: number;
    minimum_quantity: number;
}

export interface Inventory {
    id: number;
    station_id: number;
    name: string;
    items?: InventoryItem[];
}

export interface Station {
    id: number;
    name: string;
    code?: string | null;
    inventory?: Inventory | null;
}

export interface UserOption {
    id: number;
    name: string;
    email: string;
}

export interface MaterialIssuingItemData {
    id?: number;
    serial_number?: number;
    item_code?: string | null;
    valuation_type?: string | null;
    material_description?: string | null;
    pm_order?: string | null;
    unit?: string | null;
    balance: number;
    quantity: number;
    balance_after: number;
    station?: Station | null;
}

export interface MaterialIssuingForm {
    id: number;
    form_number: string;
    from_location?: string | null;
    store_location?: string | null;
    from_date?: string | null;
    to_date?: string | null;
    is_transfer: boolean;
    is_maintenance_direct_issue: boolean;
    remarks?: string | null;
    issuedBy?: UserOption | null;
    recievedBy?: UserOption | null;
    items: MaterialIssuingItemData[];
    created_at?: string;
}

export interface IndexProps {
    stations: Station[];
    forms: MaterialIssuingForm[];
    users: UserOption[];
}

export interface FormLineItem {
    inventory_item_id: string;
    item_code: string;
    material_description: string;
    unit: string;
    balance: number;
    quantity: number;
    balance_after: number;
    pm_order: string;
    valuation_type: string;
}

export interface CreateMIFFormValues {
    form_number: string;
    station_id: string;
    from_location: string;
    store_location: string;
    from_date: string;
    to_date: string;
    is_transfer: boolean;
    is_maintenance_direct_issue: boolean;
    issued_by: string;
    recieved_by: string;
    remarks: string;
    items: FormLineItem[];
}

export interface CreateMIFDialogProps {
    open: boolean;
    onClose: () => void;
    stations: Station[];
    users: UserOption[];
}

export interface MIFFormCardProps {
    form: MaterialIssuingForm;
    defaultExpanded?: boolean;
}
