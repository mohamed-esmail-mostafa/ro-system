import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "../hooks/useNavItems";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
    item: SidebarNavItem;
    active: boolean;
    isCollapsed: boolean;
    isMobile: boolean;
    onClose?: () => void;
    isRtl?: boolean;
}

export default function SidebarItem({
    item,
    active,
    isCollapsed,
    isMobile,
    onClose,
    isRtl = false,
}: SidebarItemProps) {
    const Icon = item.icon;

    const linkContent = (
        <Link
            href={item.href || '#'}
            onClick={isMobile ? onClose : undefined}
            className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                    ? "bg-white/15 text-white shadow-xs font-semibold"
                    : "text-blue-100/75 hover:bg-white/10 hover:text-white",
                isCollapsed && !isMobile && "justify-center px-2",
                active && (
                    isRtl
                        ? "before:absolute before:right-0 before:top-2 before:bottom-2 before:w-1 before:rounded-l-full before:bg-cyan-400"
                        : "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-cyan-400"
                )
            )}
        >
            <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-105", active ? "text-cyan-300" : "text-blue-100/80")} />

            {(!isCollapsed || isMobile) && (
                <span className="truncate flex-1">
                    {item.label}
                </span>
            )}

            {(!isCollapsed || isMobile) && item.badge !== undefined && (
                <span className="shrink-0 rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-medium text-cyan-200 border border-cyan-500/30">
                    {item.badge}
                </span>
            )}
        </Link>
    );

    if (isCollapsed && !isMobile) {
        return (
            <li>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {linkContent}
                    </TooltipTrigger>
                    <TooltipContent side={isRtl ? "left" : "right"} className="font-medium bg-slate-900 border border-slate-700 text-white shadow-md">
                        {item.label}
                    </TooltipContent>
                </Tooltip>
            </li>
        );
    }

    return <li>{linkContent}</li>;
}