export interface InventoryItem {
    id: number;
    inventory_id: number;
    name: string;
    code?: string | null;
    type: string;
    unit: string;
    quantity: number;
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

export interface MaterialReceivingItemData {
    id?: number;
    serial_number?: number;
    item_code?: string | null;
    material_description?: string | null;
    part_serial_number?: string | null;
    valuation_type?: string | null;
    bin_location?: string | null;
    unit?: string | null;
    quantity: number;
    sto_pro_no?: string | null;
    invoice_no?: string | null;
}

export interface MaterialReceivingForm {
    id: number;
    form_number: string;
    location?: string | null;
    from_plant?: string | null;
    store_location?: string | null;
    from_date?: string | null;
    to_date?: string | null;
    remarks?: string | null;
    operator?: string | null;
    area_supervisor?: string | null;
    department?: string | null;
    department_head?: string | null;
    receivedBy?: UserOption | null;
    reviewedBy?: UserOption | null;
    requestedBy?: UserOption | null;
    approvedBy?: UserOption | null;
    items: MaterialReceivingItemData[];
    created_at?: string;
}

export interface IndexProps {
    stations: Station[];
    forms: MaterialReceivingForm[];
    users: UserOption[];
}

export interface FormLineItem {
    inventory_item_id: string;
    item_code: string;
    material_description: string;
    unit: string;
    current_stock: number;
    quantity: number;
    part_serial_number: string;
    valuation_type: string;
    bin_location: string;
    sto_pro_no: string;
    invoice_no: string;
}

export interface CreateMRFDialogProps {
    open: boolean;
    onClose: () => void;
    stations: Station[];
    users: UserOption[];
}
