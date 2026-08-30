import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MRFSearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export function MRFSearchBar({ searchQuery, onSearchChange }: MRFSearchBarProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-gray-200 shadow-sm dark:border-gray-800">
            <CardContent className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 rtl:right-3 rtl:left-auto" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('common.search') || 'Search MRF forms, suppliers, items, users...'}
                        className="pl-9 rtl:pr-9 rtl:pl-3"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
