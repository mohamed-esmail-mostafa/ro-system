import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import useImport from '@/hooks/use-import';
export default function SearchBar({searchQuery,setSearchQuery}:any) {
    const {t}=useImport();
  return (
    <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 rtl:right-3 rtl:left-auto" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('common.search') || 'Search MIF forms, numbers, materials, users...'}
                                className="pl-9 rtl:pr-9 rtl:pl-3"
                            />
                        </div>
                    </CardContent>
                    
                </Card>
  )
}
