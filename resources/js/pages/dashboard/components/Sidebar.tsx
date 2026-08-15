import { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import useImport from '@/hooks/use-import';
import useComapny from '@/hooks/use-comapny';
import useNavItems from '../hooks/useNavItems';
import SidebarDropdown from './sidebar-dropdown';
import SidebarItem from './sidebar-item';
import { TooltipProvider } from '@/components/ui/tooltip';

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    onClose: () => void;
    onToggleCollapse: () => void;
    isMobile: boolean;
}

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse, isMobile }: SidebarProps) {
    const { t, isRtl } = useImport();
    const { company } = useComapny();
    const [logoError, setLogoError] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const { filteredItems } = useNavItems();

    const isActive = (href?: string) => {
        if (!href) return false;
        if (href === '/dashboard' || href === '/companies/dashboard') {
            return currentPath === '/dashboard' || currentPath === '/companies/dashboard' || currentPath === '/';
        }
        return currentPath.startsWith(href);
    };

    const CollapseIcon = isRtl
        ? isCollapsed ? ChevronLeft : ChevronRight
        : isCollapsed ? ChevronRight : ChevronLeft;

    return (
        <TooltipProvider delayDuration={150}>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Panel */}
            <aside
                className={cn(
                    'fixed top-0 z-50 flex h-full flex-col transition-all duration-300 ease-in-out',
                    'bg-gradient-to-b from-[#145082] via-[#0f3d64] to-[#0a2c49] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white shadow-2xl',
                    'border-slate-700/40 dark:border-slate-800/80',
                    isRtl ? 'right-0 border-l' : 'left-0 border-r',
                    // Desktop collapsed/expanded
                    !isMobile && (isCollapsed ? 'w-[72px]' : 'w-64'),
                    // Mobile slide-in/out
                    isMobile && (isOpen ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full'),
                    isMobile && 'w-72 shadow-2xl',
                )}
                aria-label="Main navigation"
            >
                {/* Header */}
                <div
                    className={cn(
                        'flex h-16 shrink-0 items-center border-b border-white/10 dark:border-slate-800/80',
                        isCollapsed && !isMobile ? 'justify-center px-3' : 'justify-between px-4',
                    )}
                >
                    {(!isCollapsed || isMobile) && (
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/15 shadow-xs overflow-hidden">
                                {company?.logo && !logoError ? (
                                    <img
                                        src={company.logo}
                                        alt={company?.name || 'Company'}
                                        onError={() => setLogoError(true)}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <Droplets className="h-5 w-5 text-cyan-300" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold tracking-tight text-white">
                                    {company?.name || t('common.appName')}
                                </p>
                                <p className="truncate text-xs text-blue-100/70">
                                    {t('common.subtitle')}
                                </p>
                            </div>
                        </div>
                    )}

                    {isCollapsed && !isMobile && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/15 shadow-xs overflow-hidden">
                            {company?.logo && !logoError ? (
                                <img
                                    src={company.logo}
                                    alt={company?.name || 'Company'}
                                    onError={() => setLogoError(true)}
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <Droplets className="h-5 w-5 text-cyan-300" />
                            )}
                        </div>
                    )}

                    {isMobile && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Navigation Items List */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-white/15 hover:scrollbar-thumb-white/25">
                    <ul className="space-y-1.5">
                        {filteredItems.map((item) => {
                            if (item.children) {
                                return (
                                    <SidebarDropdown
                                        key={item.key}
                                        item={item}
                                        isCollapsed={isCollapsed}
                                        isMobile={isMobile}
                                        onClose={onClose}
                                        isActive={isActive}
                                        isRtl={isRtl}
                                    />
                                );
                            }

                            return (
                                <SidebarItem
                                    key={item.key}
                                    item={item}
                                    active={isActive(item.href)}
                                    isCollapsed={isCollapsed}
                                    isMobile={isMobile}
                                    onClose={onClose}
                                    isRtl={isRtl}
                                />
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer / Collapse Toggle */}
                {!isMobile && (
                    <div className="shrink-0 border-t border-white/10 p-3 dark:border-slate-800/80">
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            className={cn(
                                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-blue-100/80 transition-all duration-200 hover:bg-white/10 hover:text-white',
                                isCollapsed && 'justify-center px-2',
                            )}
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <CollapseIcon className="h-4 w-4 shrink-0 text-cyan-300" />
                            {!isCollapsed && (
                                <span className="truncate">
                                    {t('common.collapse')}
                                </span>
                            )}
                        </button>
                    </div>
                )}
            </aside>
        </TooltipProvider>
    );
}
