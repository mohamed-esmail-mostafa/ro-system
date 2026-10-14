import React, { useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    UserRound,
    LayoutGrid,
    MapPin,
    BarChart3,
    Search,
    X,
    Plus,
    Sparkles,
    Settings,
} from 'lucide-react';

import useImport from '@/hooks/use-import';
import useNavItems from '@/hooks/useNavItems';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export default function BottomNavigation() {
    const { t, isRtl } = useImport();
    const { filteredItems } = useNavItems();
    const getInitials = useInitials();

    const page = usePage<any>();
    const { auth } = page.props;
    const url = page.url || '';

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const profileHref = '/users/auth/settings';
    const userName = auth?.user?.name || '';
    const userRole = auth?.user?.role?.name || auth?.user?.role?.slug || '';
    const userInitials = userName ? getInitials(userName) : '';

    // Robust, reactive path resolution based on Inertia page.url
    const currentPath = useMemo(() => {
        try {
            return new URL(
                url,
                typeof window !== 'undefined'
                    ? window.location.origin
                    : 'http://localhost',
            ).pathname;
        } catch {
            return url.split('?')[0] || '';
        }
    }, [url]);

    const isActive = (href?: string) => {
        if (!href) return false;

        const cleanHref = href.split('?')[0].replace(/\/+$/, '') || '/';
        const cleanCurrent =
            currentPath.split('?')[0].replace(/\/+$/, '') || '/';

        if (cleanHref === '/companies/dashboard' || cleanHref === '/dashboard') {
            return ['/', '/dashboard', '/companies/dashboard'].includes(
                cleanCurrent,
            );
        }

        if (cleanHref === cleanCurrent) return true;
        if (cleanHref !== '/' && cleanCurrent.startsWith(`${cleanHref}/`)) {
            return true;
        }

        return false;
    };

    // Primary items for 5-tab bar
    const stationsItem = filteredItems.find((item) => item.key === 'stations');
    const readingsItem = filteredItems.find((item) => item.key === 'readings');

    const tab2 = stationsItem
        ? {
              key: 'stations',
              label: t('stations.title'),
              href: '/stations',
              icon: MapPin,
          }
        : {
              key: 'stations',
              label: t('stations.title'),
              href: '/stations',
              icon: MapPin,
          };

    const tab4 = readingsItem
        ? {
              key: 'readings',
              label: t('readings.title'),
              href: '/readings',
              icon: BarChart3,
          }
        : {
              key: 'readings',
              label: t('readings.title'),
              href: '/readings',
              icon: BarChart3,
          };

    // Deduplicated and normalized modules for the Sheet Hub
    const allModules = useMemo(() => {
        const list: Array<{
            key: string;
            label: string;
            href: string;
            icon: React.ComponentType<{ className?: string }>;
            category: 'operations' | 'inventory' | 'management' | 'system';
            parentLabel?: string;
        }> = [];

        const seenHrefs = new Set<string>();

        filteredItems.forEach((parent) => {
            let category:
                | 'operations'
                | 'inventory'
                | 'management'
                | 'system' = 'operations';

            if (['inventory', 'activities'].includes(parent.key)) {
                category = 'inventory';
            } else if (
                ['reports', 'users', 'categories'].includes(parent.key)
            ) {
                category = 'management';
            } else if (
                ['settings', 'company-settings', 'sass-settings'].includes(
                    parent.key,
                )
            ) {
                category = 'system';
            }

            if (parent.children && parent.children.length > 0) {
                parent.children.forEach((child) => {
                    if (child.href && !seenHrefs.has(child.href)) {
                        seenHrefs.add(child.href);
                        list.push({
                            key: child.key,
                            label: child.label,
                            href: child.href,
                            icon: child.icon || parent.icon,
                            category,
                            parentLabel: parent.label,
                        });
                    }
                });
            } else if (parent.href && !seenHrefs.has(parent.href)) {
                seenHrefs.add(parent.href);
                list.push({
                    key: parent.key,
                    label: parent.label,
                    href: parent.href,
                    icon: parent.icon,
                    category,
                });
            }
        });

        return list;
    }, [filteredItems]);

    // Filter modules based on search query and selected category
    const displayModules = useMemo(() => {
        let result = allModules;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(
                (item) =>
                    item.label.toLowerCase().includes(q) ||
                    item.href.toLowerCase().includes(q) ||
                    (item.parentLabel &&
                        item.parentLabel.toLowerCase().includes(q)),
            );
        } else if (activeCategory !== 'all') {
            result = result.filter(
                (item) => item.category === activeCategory,
            );
        }

        return result;
    }, [allModules, searchQuery, activeCategory]);

    const categories = [
        { id: 'all', label: t('common.all', 'All') },
        { id: 'operations', label: t('stations.title', 'Operations') },
        { id: 'inventory', label: t('inventory.title', 'Inventory') },
        { id: 'management', label: t('reports.title', 'Management') },
        { id: 'system', label: t('users.profile', 'System') },
    ];

    const homeActive = isActive('/companies/dashboard');
    const tab2Active = isActive(tab2.href);
    const tab4Active = isActive(tab4.href);
    const profileActive = isActive(profileHref);

    return (
        <div
            className={cn(
                'fixed inset-x-0 bottom-0 z-40 md:hidden',
                'border-t border-border/70',
                'bg-background/90 dark:bg-slate-950/90 backdrop-blur-xl',
                'px-2 pt-1',
                'pb-[max(env(safe-area-inset-bottom),0.5rem)]',
                'shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)]',
            )}
        >
            <nav className="mx-auto flex h-14 max-w-md items-center justify-between">
                {/* 1. Dashboard (Home) */}
                <Link
                    href="/companies/dashboard"
                    aria-current={homeActive ? 'page' : undefined}
                    className={cn(
                        'group relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 select-none active:scale-95',
                        homeActive
                            ? 'text-primary dark:text-cyan-400 font-semibold'
                            : 'text-muted-foreground hover:text-foreground font-medium',
                    )}
                >
                    {homeActive && (
                        <span
                            aria-hidden="true"
                            className="absolute -top-1 h-1 w-6 rounded-full bg-primary dark:bg-cyan-400 shadow-[0_0_8px_rgba(20,80,130,0.6)] dark:shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                        />
                    )}
                    <div
                        className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-xl transition-transform duration-200',
                            homeActive
                                ? 'scale-110'
                                : 'group-hover:scale-105',
                        )}
                    >
                        <Home className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] leading-tight truncate max-w-[64px] mt-0.5">
                        {t('common.dashboard')}
                    </span>
                </Link>

                {/* 2. Stations */}
                <Link
                    href={tab2.href}
                    aria-current={tab2Active ? 'page' : undefined}
                    className={cn(
                        'group relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 select-none active:scale-95',
                        tab2Active
                            ? 'text-primary dark:text-cyan-400 font-semibold'
                            : 'text-muted-foreground hover:text-foreground font-medium',
                    )}
                >
                    {tab2Active && (
                        <span
                            aria-hidden="true"
                            className="absolute -top-1 h-1 w-6 rounded-full bg-primary dark:bg-cyan-400 shadow-[0_0_8px_rgba(20,80,130,0.6)] dark:shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                        />
                    )}
                    <div
                        className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-xl transition-transform duration-200',
                            tab2Active
                                ? 'scale-110'
                                : 'group-hover:scale-105',
                        )}
                    >
                        <tab2.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] leading-tight truncate max-w-[64px] mt-0.5">
                        {tab2.label}
                    </span>
                </Link>

                {/* 3. Center Elevated Hub Button (Options Sheet Trigger) */}
                <div className="relative flex flex-1 justify-center">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                aria-label={t('common.options')}
                                className={cn(
                                    'group relative -mt-6 flex h-13 w-13 items-center justify-center',
                                    'rounded-full',
                                    'border-[4px] border-background dark:border-slate-950',
                                    'bg-gradient-to-tr from-[#145082] via-[#1a629e] to-[#257dc4]',
                                    'text-white',
                                    'shadow-[0_8px_20px_-4px_rgba(20,80,130,0.45)] dark:shadow-[0_8px_22px_-4px_rgba(37,125,196,0.5)]',
                                    'transition-all duration-300 ease-out',
                                    'hover:scale-105 hover:shadow-[0_10px_24px_-4px_rgba(20,80,130,0.6)]',
                                    'active:scale-90',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                )}
                            >
                                <LayoutGrid
                                    className={cn(
                                        'h-5 w-5 transition-transform duration-300 ease-out',
                                        isOpen && 'rotate-90 scale-95',
                                    )}
                                />
                            </button>
                        </SheetTrigger>

                        <SheetContent
                            side="bottom"
                            className={cn(
                                'max-h-[88dvh] overflow-hidden rounded-t-[28px] p-0 border-t border-border/80',
                                'bg-background/98 dark:bg-slate-950/98 backdrop-blur-2xl shadow-2xl flex flex-col',
                            )}
                        >
                            {/* Sheet Header */}
                            <SheetHeader className="shrink-0 border-b border-border/60 px-5 pt-3 pb-3 text-left">
                                <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-muted-foreground/25" />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#145082] to-[#257dc4] text-white shadow-xs">
                                            <LayoutGrid className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <SheetTitle className="text-base font-bold tracking-tight text-foreground">
                                                {t('common.options', 'Navigation Hub')}
                                            </SheetTitle>
                                            <SheetDescription className="text-xs text-muted-foreground">
                                                {t(
                                                    'common.modules',
                                                    'Modules & Quick Actions',
                                                )}
                                            </SheetDescription>
                                        </div>
                                    </div>

                                    <SheetClose asChild>
                                        <button
                                            type="button"
                                            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                            aria-label="Close"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </SheetClose>
                                </div>

                                {/* Search Bar */}
                                <div className="relative mt-3">
                                    <Search
                                        className={cn(
                                            'pointer-events-none absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                                            isRtl ? 'right-3' : 'left-3',
                                        )}
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder={t(
                                            'common.search',
                                            'Search modules & actions...',
                                        )}
                                        className={cn(
                                            'h-9 w-full rounded-xl border border-border/70 bg-muted/40 text-xs text-foreground placeholder:text-muted-foreground/70 outline-none transition-all',
                                            'focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20',
                                            isRtl
                                                ? 'pr-9 pl-8 text-right'
                                                : 'pl-9 pr-8 text-left',
                                        )}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className={cn(
                                                'absolute top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground',
                                                isRtl ? 'left-2' : 'right-2',
                                            )}
                                            aria-label="Clear search"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Category Pills (shown when not actively searching) */}
                                {!searchQuery && (
                                    <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() =>
                                                    setActiveCategory(cat.id)
                                                }
                                                className={cn(
                                                    'shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150',
                                                    activeCategory === cat.id
                                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground',
                                                )}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </SheetHeader>

                            {/* Sheet Body */}
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                                {/* Quick Operator Shortcuts (when not searching and on "all") */}
                                {!searchQuery && activeCategory === 'all' && (
                                    <div>
                                        <p className="mb-2 px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                            {t(
                                                'common.quick_actions',
                                                'Quick Actions',
                                            )}
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Quick New Reading */}
                                            <SheetClose asChild>
                                                <Link
                                                    href="/readings"
                                                    className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/[0.04] p-2.5 hover:bg-primary/[0.08] transition-all active:scale-[0.98]"
                                                >
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                                                        <Plus className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-primary truncate">
                                                            {t(
                                                                'readings.create.title',
                                                                'New Reading',
                                                            )}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground truncate">
                                                            {t(
                                                                'readings.title',
                                                                'Station Log',
                                                            )}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </SheetClose>

                                            {/* Quick New Activity */}
                                            <SheetClose asChild>
                                                <Link
                                                    href="/activities/create/page"
                                                    className="flex items-center gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-2.5 hover:bg-blue-500/[0.08] transition-all active:scale-[0.98]"
                                                >
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                                                        <Sparkles className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
                                                            {t(
                                                                'activities.create',
                                                                'New Activity',
                                                            )}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground truncate">
                                                            {t(
                                                                'activities.title',
                                                                'Maintenance',
                                                            )}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </SheetClose>
                                        </div>
                                    </div>
                                )}

                                {/* Modules Grid */}
                                <div>
                                    {!searchQuery && activeCategory === 'all' && (
                                        <p className="mb-2 px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                            {t(
                                                'common.modules',
                                                'All Modules',
                                            )}
                                        </p>
                                    )}

                                    {displayModules.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                                            <Search className="h-8 w-8 mb-2 opacity-30" />
                                            <p className="text-sm font-medium">
                                                {t(
                                                    'common.no_results',
                                                    'No modules found',
                                                )}
                                            </p>
                                            <p className="text-xs opacity-75 mt-0.5">
                                                {t(
                                                    'common.try_another_search',
                                                    'Try searching with another keyword',
                                                )}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2.5">
                                            {displayModules.map((item) => {
                                                const Icon = item.icon;
                                                const active = isActive(
                                                    item.href,
                                                );

                                                return (
                                                    <SheetClose
                                                        asChild
                                                        key={item.key}
                                                    >
                                                        <Link
                                                            href={item.href}
                                                            aria-current={
                                                                active
                                                                    ? 'page'
                                                                    : undefined
                                                            }
                                                            className={cn(
                                                                'group relative flex flex-col items-center justify-center gap-2',
                                                                'rounded-2xl border p-2.5 text-center min-h-[96px]',
                                                                'transition-all duration-200 ease-out active:scale-95',
                                                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                                                active
                                                                    ? 'border-primary/40 bg-primary/[0.08] text-primary shadow-xs dark:border-primary/50 dark:bg-primary/15'
                                                                    : 'border-border/60 bg-card/70 hover:border-primary/30 hover:bg-card text-foreground shadow-xs',
                                                            )}
                                                        >
                                                            {/* Icon Container */}
                                                            <div
                                                                className={cn(
                                                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                                                                    active
                                                                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                                                                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105',
                                                                )}
                                                            >
                                                                <Icon className="h-5 w-5" />
                                                            </div>

                                                            {/* Label */}
                                                            <span
                                                                className={cn(
                                                                    'text-xs leading-snug line-clamp-2 max-w-full tracking-tight',
                                                                    active
                                                                        ? 'font-semibold text-primary dark:text-cyan-400'
                                                                        : 'font-medium text-foreground/90',
                                                                )}
                                                            >
                                                                {item.label}
                                                            </span>

                                                            {/* Active dot indicator */}
                                                            {active && (
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary"
                                                                />
                                                            )}
                                                        </Link>
                                                    </SheetClose>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sheet Footer - User info & Settings shortcut */}
                            <div className="shrink-0 border-t border-border/70 bg-muted/20 px-4 py-2.5 pb-[max(env(safe-area-inset-bottom),0.75rem)] flex items-center justify-between">
                                <SheetClose asChild>
                                    <Link
                                        href={profileHref}
                                        className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary border border-primary/20">
                                            {userInitials || (
                                                <UserRound className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1 text-left">
                                            <p className="truncate text-xs font-semibold text-foreground">
                                                {userName ||
                                                    t('users.profile')}
                                            </p>
                                            <p className="truncate text-[10px] text-muted-foreground capitalize">
                                                {userRole ||
                                                    t('common.account')}
                                            </p>
                                        </div>
                                    </Link>
                                </SheetClose>

                                <SheetClose asChild>
                                    <Link
                                        href={profileHref}
                                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        aria-label={t('users.profile')}
                                    >
                                        <Settings className="h-4 w-4" />
                                    </Link>
                                </SheetClose>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* 4. Readings */}
                <Link
                    href={tab4.href}
                    aria-current={tab4Active ? 'page' : undefined}
                    className={cn(
                        'group relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 select-none active:scale-95',
                        tab4Active
                            ? 'text-primary dark:text-cyan-400 font-semibold'
                            : 'text-muted-foreground hover:text-foreground font-medium',
                    )}
                >
                    {tab4Active && (
                        <span
                            aria-hidden="true"
                            className="absolute -top-1 h-1 w-6 rounded-full bg-primary dark:bg-cyan-400 shadow-[0_0_8px_rgba(20,80,130,0.6)] dark:shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                        />
                    )}
                    <div
                        className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-xl transition-transform duration-200',
                            tab4Active
                                ? 'scale-110'
                                : 'group-hover:scale-105',
                        )}
                    >
                        <tab4.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] leading-tight truncate max-w-[64px] mt-0.5">
                        {tab4.label}
                    </span>
                </Link>

                {/* 5. Profile */}
                <Link
                    href={profileHref}
                    aria-current={profileActive ? 'page' : undefined}
                    className={cn(
                        'group relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 select-none active:scale-95',
                        profileActive
                            ? 'text-primary dark:text-cyan-400 font-semibold'
                            : 'text-muted-foreground hover:text-foreground font-medium',
                    )}
                >
                    {profileActive && (
                        <span
                            aria-hidden="true"
                            className="absolute -top-1 h-1 w-6 rounded-full bg-primary dark:bg-cyan-400 shadow-[0_0_8px_rgba(20,80,130,0.6)] dark:shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                        />
                    )}
                    <div
                        className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-xl transition-transform duration-200',
                            profileActive
                                ? 'scale-110'
                                : 'group-hover:scale-105',
                        )}
                    >
                        <UserRound className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] leading-tight truncate max-w-[64px] mt-0.5">
                        {t('users.profile')}
                    </span>
                </Link>
            </nav>
        </div>
    );
}
