import { Link } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "../hooks/useNavItems";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarDropdownProps {
    item: SidebarNavItem;
    isCollapsed: boolean;
    isMobile: boolean;
    onClose?: () => void;
    isActive: (href?: string) => boolean;
    isRtl?: boolean;
}

export default function SidebarDropdown({
    item,
    isCollapsed,
    isMobile,
    onClose,
    isActive,
    isRtl = false,
}: SidebarDropdownProps) {
    const hasActiveChild = item.children?.some(
        (child) => isActive(child.href)
    );

    const [open, setOpen] = useState(hasActiveChild || false);

    // Keep dropdown open if a child becomes active
    useEffect(() => {
        if (hasActiveChild) {
            setOpen(true);
        }
    }, [hasActiveChild]);

    const Icon = item.icon;

    const buttonContent = (
        <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                open || hasActiveChild
                    ? "bg-white/10 text-white"
                    : "text-blue-100/75 hover:bg-white/10 hover:text-white",
                isCollapsed && !isMobile && "justify-center px-2",
                hasActiveChild && (
                    isRtl
                        ? "before:absolute before:right-0 before:top-2 before:bottom-2 before:w-1 before:rounded-l-full before:bg-cyan-400"
                        : "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-cyan-400"
                )
            )}
        >
            <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-105", hasActiveChild ? "text-cyan-300" : "text-blue-100/80")} />

            {(!isCollapsed || isMobile) && (
                <>
                    <span className="flex-1 text-start truncate">
                        {item.label}
                    </span>

                    <ChevronDown
                        className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-200 text-blue-100/70",
                            open && "rotate-180 text-white"
                        )}
                    />
                </>
            )}
        </button>
    );

    return (
        <li>
            {isCollapsed && !isMobile ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        {buttonContent}
                    </TooltipTrigger>
                    <TooltipContent side={isRtl ? "left" : "right"} className="font-medium bg-slate-900 border border-slate-700 text-white shadow-md">
                        <div>
                            <p className="font-bold border-b border-slate-700 pb-1 mb-1 text-cyan-300">{item.label}</p>
                            <ul className="space-y-1">
                                {item.children?.map((child) => (
                                    <li key={child.key} className={cn("text-xs", isActive(child.href) && "text-cyan-400 font-semibold")}>
                                        • {child.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </TooltipContent>
                </Tooltip>
            ) : (
                buttonContent
            )}

            {open && (!isCollapsed || isMobile) && item.children && (
                <ul
                    className={cn(
                        "mt-1 space-y-1 transition-all duration-200",
                        isRtl
                            ? "border-r border-white/15 mr-5 pr-2.5"
                            : "border-l border-white/15 ml-5 pl-2.5"
                    )}
                >
                    {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const active = isActive(child.href);

                        return (
                            <li key={child.key}>
                                <Link
                                    href={child.href || '#'}
                                    onClick={isMobile ? onClose : undefined}
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-200",
                                        active
                                            ? "bg-white/20 text-white font-semibold shadow-xs"
                                            : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    {ChildIcon ? (
                                        <ChildIcon className={cn("h-3.5 w-3.5 shrink-0", active ? "text-cyan-300" : "text-blue-100/60")} />
                                    ) : (
                                        <span
                                            className={cn(
                                                "h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
                                                active ? "bg-cyan-400" : "bg-white/40"
                                            )}
                                        />
                                    )}

                                    <span className="truncate">{child.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
}