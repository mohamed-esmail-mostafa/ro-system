import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    MapPin,
    Search,
    Shield,
    Mail,
    Phone,
    Building2,
    LayoutGrid,
    Table as TableIcon,
    CheckCircle2,
    XCircle,
    UserCheck,
    ArrowUpRight,
    Filter,
    HardHat,
} from 'lucide-react';

import DashboardLayout from '@/layouts/dashboard-layout';
import PageHeader from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useImport from '@/hooks/use-import';
import useComapny from '@/hooks/use-comapny';
import { cn } from '@/lib/utils';

export interface StationOperatorUser {
    id: number;
    company_id: number;
    name: string;
    email: string;
    username: string;
    phone: string | null;
    role_id?: number;
    avatar?: string | null;
    is_active?: number | boolean;
    last_active?: string | null;
    type?: string;
    role?: {
        id: number;
        name: string;
        slug?: string;
    };
    pivot?: {
        station_id: number;
        user_id: number;
    };
}

export interface StationWithOperators {
    id: number;
    company_id: number;
    name: string;
    slug: string;
    code: string;
    phone: string | null;
    country: string | null;
    city: string | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    users?: StationOperatorUser[];
    pivot?: {
        user_id: number;
        station_id: number;
    };
}

interface OperatorsPageProps {
    operators: StationWithOperators[];
}

function getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/u).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getRoleBadgeStyle(roleName?: string) {
    const name = (roleName || '').toLowerCase();
    if (name.includes('admin')) {
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
    }
    if (name.includes('chemical')) {
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
    }
    if (name.includes('supervis')) {
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
}

export default function StationOperators({ operators }: OperatorsPageProps) {
    const { t, isRtl } = useImport();
    const { company } = useComapny();
    console.log("operators", operators)

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStationId, setSelectedStationId] = useState<number | 'all'>('all');
    const [viewMode, setViewMode] = useState<'stations' | 'directory'>('stations');

    const stationsList = useMemo(() => operators ?? [], [operators]);

    // Unique operators list across all stations
    const uniqueOperatorsMap = useMemo(() => {
        const map = new Map<
            number,
            {
                user: StationOperatorUser;
                assignedStations: Array<{ id: number; name: string; code: string }>;
            }
        >();

        stationsList.forEach((station) => {
            (station.users ?? []).forEach((user) => {
                const existing = map.get(user.id);
                if (existing) {
                    if (!existing.assignedStations.some((s) => s.id === station.id)) {
                        existing.assignedStations.push({
                            id: station.id,
                            name: station.name,
                            code: station.code,
                        });
                    }
                } else {
                    map.set(user.id, {
                        user,
                        assignedStations: [
                            {
                                id: station.id,
                                name: station.name,
                                code: station.code,
                            },
                        ],
                    });
                }
            });
        });

        return Array.from(map.values());
    }, [stationsList]);

    // Filter stations and their operators
    const filteredStations = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return stationsList
            .filter((station) => {
                if (selectedStationId !== 'all' && station.id !== selectedStationId) {
                    return false;
                }

                if (!query) return true;

                const matchStation =
                    station.name.toLowerCase().includes(query) ||
                    station.code.toLowerCase().includes(query) ||
                    (station.city && station.city.toLowerCase().includes(query));

                const matchUsers = (station.users ?? []).some(
                    (user) =>
                        user.name.toLowerCase().includes(query) ||
                        user.email.toLowerCase().includes(query) ||
                        user.username.toLowerCase().includes(query) ||
                        (user.phone && user.phone.includes(query)) ||
                        (user.role?.name &&
                            user.role.name.toLowerCase().includes(query)),
                );

                return matchStation || matchUsers;
            })
            .map((station) => {
                if (!query) return station;

                // When searching, also filter the inner users list unless the station itself matches
                const stationMatches =
                    station.name.toLowerCase().includes(query) ||
                    station.code.toLowerCase().includes(query);

                if (stationMatches) return station;

                return {
                    ...station,
                    users: (station.users ?? []).filter(
                        (user) =>
                            user.name.toLowerCase().includes(query) ||
                            user.email.toLowerCase().includes(query) ||
                            user.username.toLowerCase().includes(query) ||
                            (user.phone && user.phone.includes(query)) ||
                            (user.role?.name &&
                                user.role.name.toLowerCase().includes(query)),
                    ),
                };
            });
    }, [stationsList, searchQuery, selectedStationId]);

    // Filtered operators for directory view
    const filteredDirectory = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return uniqueOperatorsMap.filter(({ user, assignedStations }) => {
            if (
                selectedStationId !== 'all' &&
                !assignedStations.some((s) => s.id === selectedStationId)
            ) {
                return false;
            }

            if (!query) return true;

            return (
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.username.toLowerCase().includes(query) ||
                (user.phone && user.phone.includes(query)) ||
                (user.role?.name &&
                    user.role.name.toLowerCase().includes(query)) ||
                assignedStations.some(
                    (s) =>
                        s.name.toLowerCase().includes(query) ||
                        s.code.toLowerCase().includes(query),
                )
            );
        });
    }, [uniqueOperatorsMap, searchQuery, selectedStationId]);

    // Statistics
    const totalStations = stationsList.length;
    const activeStations = stationsList.filter((s) => s.is_active).length;
    const totalOperatorsCount = uniqueOperatorsMap.length;
    const stationsWithOperatorsCount = stationsList.filter(
        (s) => (s.users?.length ?? 0) > 0,
    ).length;

    return (
        <DashboardLayout>
            <Head title={`${t('stations.operators', 'Station Operators')} — AquaRO`} />

            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    icon={<HardHat className="h-6 w-6 text-white" />}
                    title={t('stations.operators', 'Station Operators')}
                   
                >
                    <div className="flex items-center gap-2">
                        {/* <Link href="/users">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 border-border/80 shadow-xs"
                            >
                                <Users className="h-4 w-4" />
                                {t('users.title', 'All Users')}
                            </Button>
                        </Link> */}
                        <Link href="/stations">
                            <Button className="flex items-center gap-2 shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                                <MapPin className="h-4 w-4" />
                                {t('stations.title', 'Stations')}
                            </Button>
                        </Link>
                    </div>
                </PageHeader>

                {/* Key Metrics Stats Row */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs transition-all hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {t('stations.title', 'Total Stations')}
                            </p>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Building2 className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {totalStations}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {activeStations} {t('common.active', 'active')}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs transition-all hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {t('stations.operators', 'Total Operators')}
                            </p>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {totalOperatorsCount}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {t('common.assigned_personnel', 'Field personnel')}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs transition-all hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {t('common.covered_stations', 'Coverage')}
                            </p>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            {totalStations > 0
                                ? `${Math.round(
                                      (stationsWithOperatorsCount /
                                          totalStations) *
                                          100,
                                  )}%`
                                : '0%'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {stationsWithOperatorsCount} / {totalStations}{' '}
                            {t('stations.title', 'stations staffed')}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs transition-all hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {t('common.avg_operators', 'Avg Team Size')}
                            </p>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <UserCheck className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {totalStations > 0
                                ? (
                                      uniqueOperatorsMap.length / totalStations
                                  ).toFixed(1)
                                : '0'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {t('common.per_station', 'operators / station')}
                        </p>
                    </div>
                </div>

                {/* Filter and View Controls Toolbar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: Search input */}
                    <div className="relative flex-1 max-w-md">
                        <Search
                            className={cn(
                                'pointer-events-none absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                                isRtl ? 'right-3' : 'left-3',
                            )}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t(
                                'common.search_operators',
                                'Search stations, operators, email, phone...',
                            )}
                            className={cn(
                                'h-10 w-full rounded-xl border border-border/70 bg-background/80 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all',
                                'focus:border-primary focus:ring-2 focus:ring-primary/20',
                                isRtl ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left',
                            )}
                        />
                    </div>

                    {/* Right: Station Dropdown filter + View mode switch */}
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {/* Station Filter Select */}
                        <div className="relative flex items-center">
                            <Filter className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                            <select
                                value={selectedStationId}
                                onChange={(e) =>
                                    setSelectedStationId(
                                        e.target.value === 'all'
                                            ? 'all'
                                            : Number(e.target.value),
                                    )
                                }
                                className={cn(
                                    'h-10 rounded-xl border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground outline-none transition-all',
                                    'focus:border-primary focus:ring-2 focus:ring-primary/20 sm:pl-8',
                                )}
                            >
                                <option value="all">
                                    {t('common.all_stations', 'All Stations')} (
                                    {stationsList.length})
                                </option>
                                {stationsList.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.code}) &mdash;{' '}
                                        {s.users?.length ?? 0}{' '}
                                        {t('stations.operators', 'operators')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center rounded-xl border border-border/70 bg-muted/50 p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode('stations')}
                                className={cn(
                                    'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                                    viewMode === 'stations'
                                        ? 'bg-background text-foreground shadow-xs font-semibold'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                                title={t(
                                    'common.grouped_view',
                                    'Group by Station',
                                )}
                            >
                                <LayoutGrid className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">
                                    {t('stations.title', 'Stations')}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setViewMode('directory')}
                                className={cn(
                                    'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                                    viewMode === 'directory'
                                        ? 'bg-background text-foreground shadow-xs font-semibold'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                                title={t(
                                    'common.directory_view',
                                    'All Operators Directory',
                                )}
                            >
                                <TableIcon className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">
                                    {t('users.title', 'Directory')}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 1. VIEW MODE: GROUPED BY STATION */}
                {viewMode === 'stations' && (
                    <div className="space-y-5">
                        {filteredStations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/60 py-16 text-center">
                                <Building2 className="mb-3 h-12 w-12 text-muted-foreground/40" />
                                <p className="text-base font-semibold text-foreground">
                                    {t(
                                        'stations.no_results',
                                        'No matching stations found',
                                    )}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                                    {t(
                                        'common.try_another_search',
                                        'Try adjusting your search criteria or filter to see stations and operators.',
                                    )}
                                </p>
                            </div>
                        ) : (
                            filteredStations.map((station) => {
                                const users = station.users ?? [];

                                return (
                                    <div
                                        key={station.id}
                                        className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs transition-all hover:border-primary/30 hover:shadow-sm"
                                    >
                                        {/* Station Card Header */}
                                        <div className="flex flex-col gap-3 border-b border-border/70 bg-muted/25 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#145082] to-[#257dc4] text-white shadow-xs">
                                                    <Building2 className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h2 className="text-base font-bold text-foreground truncate">
                                                            {station.name}
                                                        </h2>
                                                        <span className="rounded-md border border-border/80 bg-background/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground/80 shadow-2xs">
                                                            {station.code}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                'text-[10px] font-semibold py-0',
                                                                station.is_active
                                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                                    : 'bg-muted text-muted-foreground border-border',
                                                            )}
                                                        >
                                                            {station.is_active
                                                                ? t(
                                                                      'common.active',
                                                                      'Active',
                                                                  )
                                                                : t(
                                                                      'common.inactive',
                                                                      'Inactive',
                                                                  )}
                                                        </Badge>
                                                    </div>

                                                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                                        {(station.city ||
                                                            station.address) && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {[
                                                                    station.city,
                                                                    station.address,
                                                                ]
                                                                    .filter(
                                                                        Boolean,
                                                                    )
                                                                    .join(', ')}
                                                            </span>
                                                        )}
                                                        {station.phone && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                {station.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Operators count pill & Quick link */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Badge
                                                    variant="secondary"
                                                    className="font-semibold text-xs px-2.5 py-1"
                                                >
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {users.length}{' '}
                                                    {t(
                                                        'stations.operators',
                                                        'Operators',
                                                    )}
                                                </Badge>
                                                <Link
                                                    href={`/stations`}
                                                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                                >
                                                    {t(
                                                        'common.manage',
                                                        'Manage',
                                                    )}
                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Assigned Operators Grid */}
                                        <div className="p-5">
                                            {users.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 py-8 text-center">
                                                    <Users className="h-8 w-8 text-muted-foreground/40 mb-2" />
                                                    <p className="text-sm font-medium text-foreground">
                                                        {t(
                                                            'stations.no_operators_assigned',
                                                            'No operators assigned to this station',
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {t(
                                                            'stations.assign_operator_prompt',
                                                            'Assign staff from the users management section.',
                                                        )}
                                                    </p>
                                                    <Link
                                                        href="/users"
                                                        className="mt-3"
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            <Users className="h-3.5 w-3.5 mr-1.5" />
                                                            {t(
                                                                'users.assign',
                                                                'Assign Operators',
                                                            )}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                    {users.map((user) => {
                                                        const roleLabel =
                                                            user.role?.name ??
                                                            (user.role_id === 2
                                                                ? 'Company Admin'
                                                                : user.role_id ===
                                                                  5
                                                                ? 'Station Operator'
                                                                : 'Personnel');

                                                        return (
                                                            <div
                                                                key={user.id}
                                                                className={cn(
                                                                    'group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5',
                                                                    'shadow-2xs transition-all hover:border-primary/40 hover:bg-muted/10 hover:shadow-xs',
                                                                )}
                                                            >
                                                                {/* Top User Info */}
                                                                <div>
                                                                    <div className="flex items-start gap-3">
                                                                        <Avatar className="h-10 w-10 border border-primary/20 shadow-2xs">
                                                                            {user.avatar && (
                                                                                <AvatarImage
                                                                                    src={
                                                                                        user.avatar
                                                                                    }
                                                                                    alt={
                                                                                        user.name
                                                                                    }
                                                                                />
                                                                            )}
                                                                            <AvatarFallback className="bg-gradient-to-tr from-[#145082]/15 to-[#257dc4]/20 font-bold text-xs text-primary dark:text-cyan-300">
                                                                                {getInitials(
                                                                                    user.name,
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>

                                                                        <div className="min-w-0 flex-1">
                                                                            <h3 className="text-sm font-semibold text-foreground truncate">
                                                                                {
                                                                                    user.name
                                                                                }
                                                                            </h3>
                                                                            <p className="text-[11px] text-muted-foreground truncate">
                                                                                @{user.username}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Role and Status Badges */}
                                                                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                                                                        <span
                                                                            className={cn(
                                                                                'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium',
                                                                                getRoleBadgeStyle(
                                                                                    roleLabel,
                                                                                ),
                                                                            )}
                                                                        >
                                                                            <Shield className="h-3 w-3" />
                                                                            {
                                                                                roleLabel
                                                                            }
                                                                        </span>

                                                                        <span
                                                                            className={cn(
                                                                                'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                                                                                user.is_active
                                                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                                                    : 'text-muted-foreground',
                                                                            )}
                                                                        >
                                                                            <span
                                                                                className={cn(
                                                                                    'h-1.5 w-1.5 rounded-full',
                                                                                    user.is_active
                                                                                        ? 'bg-emerald-500'
                                                                                        : 'bg-muted-foreground',
                                                                                )}
                                                                            />
                                                                            {user.is_active
                                                                                ? t(
                                                                                      'common.active',
                                                                                      'Active',
                                                                                  )
                                                                                : t(
                                                                                      'common.inactive',
                                                                                      'Inactive',
                                                                                  )}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Contact details footer */}
                                                                <div className="mt-3.5 border-t border-border/60 pt-2.5 space-y-1">
                                                                    {user.email && (
                                                                        <a
                                                                            href={`mailto:${user.email}`}
                                                                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors truncate"
                                                                            title={
                                                                                user.email
                                                                            }
                                                                        >
                                                                            <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                                                            <span className="truncate">
                                                                                {
                                                                                    user.email
                                                                                }
                                                                            </span>
                                                                        </a>
                                                                    )}

                                                                    {user.phone && (
                                                                        <a
                                                                            href={`tel:${user.phone}`}
                                                                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors truncate"
                                                                            title={
                                                                                user.phone
                                                                            }
                                                                        >
                                                                            <Phone className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                                                            <span className="truncate">
                                                                                {
                                                                                    user.phone
                                                                                }
                                                                            </span>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* 2. VIEW MODE: ALL OPERATORS DIRECTORY TABLE */}
                {viewMode === 'directory' && (
                    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
                        {filteredDirectory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Users className="mb-3 h-12 w-12 text-muted-foreground/40" />
                                <p className="text-base font-semibold text-foreground">
                                    {t(
                                        'users.no_results',
                                        'No matching operators found',
                                    )}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {t(
                                        'common.try_another_search',
                                        'Try adjusting your search criteria.',
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border/70">
                                    <thead>
                                        <tr className="bg-muted/40 text-muted-foreground">
                                            <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wider">
                                                {t(
                                                    'users.table.name',
                                                    'Operator',
                                                )}
                                            </th>
                                            <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wider">
                                                {t('users.table.role', 'Role')}
                                            </th>
                                            <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wider">
                                                {t(
                                                    'users.table.stations',
                                                    'Assigned Stations',
                                                )}
                                            </th>
                                            <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wider">
                                                {t(
                                                    'users.table.contact',
                                                    'Contact Info',
                                                )}
                                            </th>
                                            <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wider">
                                                {t(
                                                    'common.status',
                                                    'Status',
                                                )}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {filteredDirectory.map(
                                            ({ user, assignedStations }) => {
                                                const roleLabel =
                                                    user.role?.name ??
                                                    (user.role_id === 2
                                                        ? 'Company Admin'
                                                        : user.role_id === 5
                                                        ? 'Station Operator'
                                                        : 'Personnel');

                                                return (
                                                    <tr
                                                        key={user.id}
                                                        className="hover:bg-muted/20 transition-colors"
                                                    >
                                                        {/* Operator Column */}
                                                        <td className="px-5 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-9 w-9 border border-primary/20">
                                                                    {user.avatar && (
                                                                        <AvatarImage
                                                                            src={
                                                                                user.avatar
                                                                            }
                                                                            alt={
                                                                                user.name
                                                                            }
                                                                        />
                                                                    )}
                                                                    <AvatarFallback className="bg-primary/10 font-bold text-xs text-primary dark:text-cyan-300">
                                                                        {getInitials(
                                                                            user.name,
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-foreground">
                                                                        {
                                                                            user.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        @
                                                                        {
                                                                            user.username
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Role Column */}
                                                        <td className="px-5 py-4 whitespace-nowrap">
                                                            <span
                                                                className={cn(
                                                                    'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
                                                                    getRoleBadgeStyle(
                                                                        roleLabel,
                                                                    ),
                                                                )}
                                                            >
                                                                <Shield className="h-3 w-3" />
                                                                {roleLabel}
                                                            </span>
                                                        </td>

                                                        {/* Assigned Stations Column */}
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                                                                {assignedStations.map(
                                                                    (
                                                                        st,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                st.id
                                                                            }
                                                                            className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-background px-2 py-1 text-xs font-medium text-foreground shadow-2xs"
                                                                        >
                                                                            <MapPin className="h-3 w-3 text-primary" />
                                                                            <span className="font-semibold truncate max-w-[120px]">
                                                                                {
                                                                                    st.name
                                                                                }
                                                                            </span>
                                                                            <span className="text-[10px] text-muted-foreground">
                                                                                (
                                                                                {
                                                                                    st.code
                                                                                }
                                                                                )
                                                                            </span>
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Contact Info Column */}
                                                        <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
                                                            <div className="space-y-1">
                                                                {user.email && (
                                                                    <a
                                                                        href={`mailto:${user.email}`}
                                                                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                                                                    >
                                                                        <Mail className="h-3.5 w-3.5" />
                                                                        <span>
                                                                            {
                                                                                user.email
                                                                            }
                                                                        </span>
                                                                    </a>
                                                                )}
                                                                {user.phone && (
                                                                    <a
                                                                        href={`tel:${user.phone}`}
                                                                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                                                                    >
                                                                        <Phone className="h-3.5 w-3.5" />
                                                                        <span>
                                                                            {
                                                                                user.phone
                                                                            }
                                                                        </span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Status Column */}
                                                        <td className="px-5 py-4 whitespace-nowrap">
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    'text-[11px] font-semibold',
                                                                    user.is_active
                                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                                        : 'bg-muted text-muted-foreground border-border',
                                                                )}
                                                            >
                                                                {user.is_active
                                                                    ? t(
                                                                          'common.active',
                                                                          'Active',
                                                                      )
                                                                    : t(
                                                                          'common.inactive',
                                                                          'Inactive',
                                                                      )}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
