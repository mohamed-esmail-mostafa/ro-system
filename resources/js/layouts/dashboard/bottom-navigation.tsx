import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    UserRound,
    LayoutGrid,
    ChevronRight,
    X,
} from 'lucide-react';

import useImport from '@/hooks/use-import';

import { cn } from '@/lib/utils';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from '@/components/ui/sheet';
import useNavItems from '@/hooks/useNavItems';

export default function BottomNavigation() {
    const { t } = useImport();
    const { filteredItems } = useNavItems();
    const { auth } = usePage().props as any;

    const currentPath =
        typeof window !== 'undefined'
            ? window.location.pathname
            : '';

    const profileHref = '/users/auth/settings';

    const isActive = (href?: string) => {
        if (!href) return false;

        if (
            href === '/companies/dashboard' &&
            ['/', '/dashboard', '/companies/dashboard'].includes(currentPath)
        ) {
            return true;
        }

        return currentPath === href ||
            currentPath.startsWith(`${href}/`);
    };

    const homeActive = isActive('/companies/dashboard');
    const profileActive = isActive(profileHref);

    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-5 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
            <nav className="mx-auto flex h-14 max-w-md items-center justify-around">
                {/* Home */}
                <Link
                    href="/companies/dashboard"
                    aria-current={homeActive ? 'page' : undefined}
                    className={cn(
                        'flex min-w-16 flex-col items-center justify-center gap-1 transition-colors',
                        homeActive
                            ? 'text-cyan-600 dark:text-cyan-400'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    )}
                >
                    <Home
                        className={cn(
                            'h-5 w-5',
                            homeActive && 'fill-cyan-500/10'
                        )}
                    />
                    <span className="text-[11px] font-medium">
                        {t('common.dashboard')}
                    </span>
                </Link>

                {/* Center Options Button */}
                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            aria-label={t('common.options')}
                            className="group -mt-7 flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-white bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 text-white shadow-lg shadow-cyan-500/30 transition-transform active:scale-95 dark:border-slate-950"
                        >
                            <LayoutGrid className="h-6 w-6 transition-transform duration-300 group-data-[state=open]:rotate-45" />
                        </button>
                    </SheetTrigger>

                    <SheetContent
                        side="bottom"
                        className="max-h-[85dvh] overflow-hidden rounded-t-3xl border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-slate-950"
                    >
                        <SheetHeader className="border-b border-slate-100 px-5 pb-4 pt-5 text-left dark:border-slate-800">
                            <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />

                            <div className="flex items-center justify-between pr-8">
                                <div>
                                    <SheetTitle className="text-lg font-bold">
                                        {t('common.options')}
                                    </SheetTitle>

                                    <SheetDescription className="mt-1">
                                        {t('common.dashboard')}
                                    </SheetDescription>
                                </div>

                                <LayoutGrid className="h-6 w-6 text-cyan-500" />
                            </div>
                        </SheetHeader>

                        <div className="overflow-y-auto px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3">
                            <div className="space-y-2">
                                {filteredItems.map((item) => {
                                    const Icon = item.icon;

                                    const itemActive =
                                        isActive(item.href) ||
                                        item.children?.some((child) =>
                                            isActive(child.href)
                                        );

                                    return (
                                        <div
                                            key={item.key}
                                            className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800"
                                        >
                                            {item.href ? (
                                                <SheetClose asChild>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            'flex min-h-14 items-center gap-3 px-4 py-3 transition-colors',
                                                            itemActive
                                                                ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400'
                                                                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900'
                                                        )}
                                                    >
                                                        <Icon className="h-5 w-5 shrink-0" />

                                                        <span className="flex-1 text-sm font-medium">
                                                            {item.label}
                                                        </span>

                                                        <ChevronRight className="h-4 w-4 opacity-50" />
                                                    </Link>
                                                </SheetClose>
                                            ) : (
                                                <div
                                                    className={cn(
                                                        'flex items-center gap-3 px-4 py-3',
                                                        itemActive
                                                            ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400'
                                                            : 'text-slate-700 dark:text-slate-200'
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5 shrink-0" />

                                                    <span className="text-sm font-semibold">
                                                        {item.label}
                                                    </span>
                                                </div>
                                            )}

                                            {item.children &&
                                                item.children.length > 0 && (
                                                    <div className="space-y-1 border-t border-slate-100 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-slate-900/40">
                                                        {item.children.map(
                                                            (child) => {
                                                                const ChildIcon =
                                                                    child.icon;
                                                                const childActive =
                                                                    isActive(child.href);

                                                                return (
                                                                    <SheetClose
                                                                        asChild
                                                                        key={child.key}
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                child.href ?? '#'
                                                                            }
                                                                            className={cn(
                                                                                'flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                                                                                childActive
                                                                                    ? 'bg-cyan-100 font-semibold text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300'
                                                                                    : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800'
                                                                            )}
                                                                        >
                                                                            <ChildIcon className="h-4 w-4 shrink-0" />

                                                                            <span className="flex-1">
                                                                                {child.label}
                                                                            </span>

                                                                            {childActive && (
                                                                                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                                                                            )}
                                                                        </Link>
                                                                    </SheetClose>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Profile */}
                <Link
                    href={profileHref}
                    aria-current={profileActive ? 'page' : undefined}
                    className={cn(
                        'flex min-w-16 flex-col items-center justify-center gap-1 transition-colors',
                        profileActive
                            ? 'text-cyan-600 dark:text-cyan-400'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    )}
                >
                    <UserRound className="h-5 w-5" />

                    <span className="text-[11px] font-medium">
                        {t('users.profile')}
                    </span>
                </Link>
            </nav>
        </div>
    );
}