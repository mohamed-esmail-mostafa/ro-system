import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'
import React from 'react'

export default function ReportsPagination({ data, total, from, to, links, last_page }: any) {
    return (
        <div>
            {data.length > 0 && last_page > 1 && (
                <div className="flex flex-col items-center gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between dark:border-gray-800">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-gray-900 dark:text-white">{from}–{to}</span> of{' '}
                        <span className="font-medium text-gray-900 dark:text-white">{total}</span> reports
                    </p>

                    <div className="flex items-center gap-1">
                        {links
                            .filter((l: any) => l.page !== null)
                            .map((link: any) => (
                                <Button
                                    key={link.page}
                                    size="sm"
                                    variant={link.active ? 'default' : 'outline'}
                                    className={`h-8 min-w-[2rem] px-2 text-xs ${link.active ? 'bg-teal-600 hover:bg-teal-700' : ''
                                        }`}
                                    onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                >
                                    {link.page}
                                </Button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    )
}
