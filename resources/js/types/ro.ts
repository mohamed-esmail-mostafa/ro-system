export interface Parameter {
    id: number;
    name: string;
    code?: string | null;
    unit?: string | null;
    input_type?: 'NUMBER' | 'TEXT' | 'BOOLEAN';
    min_value?: number | null;
    max_value?: number | null;
    order?: number;
    is_required?: boolean;
    is_active?: boolean;
    usage?: 'READING' | 'DAILY_REPORT' | 'BOTH';
    track_difference?: boolean;
    value?: string;
    difference?: number;
}
export interface Station {
    id: string;
    name: string;
    companyId: string;
    location: string;
    unitCount: number;
    address:string;
    is_active:boolean;
    ro_units:RoUnit[] 
}

export interface Category {
    id: number;
    name: string;
    order?: number;
    is_system?: boolean;
    parameters: Parameter[];
    pivot?: { is_active: boolean; order: number };
}

export interface RoUnit {
    id: number;
    name: string;
    code: string;
    reading_categories: Category[];
    readingParameters: Parameter[];
    reading_parameters: Parameter[];
    ro_unit_reading_categories:Category[];
}


export interface Session {
    id: number;
    ro_unit_id: number;
    reading_at: string;
    categories: Category[];
}



export interface Company {
    id: string;
    name: string;
    logoInitials: string;
    email:string;
    phone:number;
    whatsapp:number;
    website:string;
    country:string;
    city:string;
    address:string;
    description:string;
}


export interface Report {
    id: number;
    report_date: string;
    actions?: string | null;
    recommendations?: string | null;
    operator_name?:string | null
    categories: Category[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

export interface PaginatedReports {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    data: Report[];
    links: PaginationLink[];
    next_page_url: string | null;
    prev_page_url: string | null;
}