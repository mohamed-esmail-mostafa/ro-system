import useImport from '@/hooks/use-import';
import { usePage, Link } from '@inertiajs/react';
import { LayoutDashboard, Plus, FileBarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BottomNavItem {
    key: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: string[];
    isPrimaryAction?: boolean;
}

export default function BottomNavigation() {
    const { t } = useImport();
    const { auth } = usePage().props as any;
    const role = auth?.user?.role?.slug;

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const navItems: BottomNavItem[] = [
        {
            key: 'dashboard',
            label: t('common.dashboard'),
            href: '/companies/dashboard',
            icon: LayoutDashboard,
        },
        {
            key: 'add-new-readings',
            label: t('readings.create.title'),
            href: '/readings',
            icon: Plus,
            roles: ['company-admin', 'operator', 'chemical'],
            isPrimaryAction: true,
        },
        {
            key: 'reports',
            label: t('reports.title'),
            href: '/reports',
            icon: FileBarChart,
            roles: ['company-admin', 'operator', 'chemical'],
        },
    ];

    const visibleItems = navItems.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(role);
    });

    const isActive = (href: string) => {
        if (href === '/companies/dashboard') {
            return currentPath === '/dashboard' || currentPath === '/companies/dashboard' || currentPath === '/';
        }
        return currentPath.startsWith(href);
    };

    return (
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-3 py-1 shadow-2xl">
            <nav className="flex items-end justify-around max-w-md mx-auto relative h-14">
                {visibleItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    if (item.isPrimaryAction) {
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className="group relative -translate-y-3 flex flex-col items-center justify-center focus:outline-none"
                            >
                                <div
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-900 shadow-xl transition-all duration-200 group-active:scale-95',
                                        active
                                            ? 'bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 text-white shadow-cyan-500/30 scale-105'
                                            : 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-blue-500/25 hover:brightness-110'
                                    )}
                                >
                                    <Icon className="h-6 w-6 transition-transform group-hover:rotate-90 duration-300" />
                                </div>
                                <span className={cn('text-[10px] font-semibold mt-0.5 truncate max-w-[90px] text-center', active ? 'text-cyan-400' : 'text-blue-100/80')}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={cn(
                                'flex flex-1 flex-col items-center justify-center pb-1 pt-1.5 px-2 text-center transition-all duration-200 relative h-full',
                                active
                                    ? 'text-cyan-400 font-semibold'
                                    : 'text-slate-400 hover:text-slate-200 font-medium'
                            )}
                        >
                            {/* Active top glow indicator */}
                            {active && (
                                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                            )}
                            <Icon className={cn('h-5 w-5 mb-1 transition-transform group-hover:scale-110', active && 'scale-110 text-cyan-400')} />
                            <span className="text-[11px] leading-none truncate max-w-[90px]">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
