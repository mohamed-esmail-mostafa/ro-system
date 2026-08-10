import { Eye, EyeOff } from 'lucide-react';
import type { ComponentProps, Ref } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function PasswordInput({
    className,
    ref,
    ...props
}: Omit<ComponentProps<'input'>, 'type'> & { ref?: Ref<HTMLInputElement> }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            <Input
                type={showPassword ? 'text' : 'password'}
                className={cn('pr-10 rtl:pl-10 rtl:pr-3', className)}
                ref={ref}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center rounded-r-md rtl:rounded-l-md rtl:rounded-r-none px-3 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-teal-500/20 focus-visible:outline-none transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
            >
                {showPassword ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
            </button>
        </div>
    );
}
