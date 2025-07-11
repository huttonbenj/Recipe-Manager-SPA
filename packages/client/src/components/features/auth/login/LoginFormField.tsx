import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface LoginFormFieldProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | undefined;
    icon: LucideIcon;
    autoComplete?: string;
    isFirst?: boolean;
    isLast?: boolean;
    testId?: string;
}

export const LoginFormField = ({
    id,
    label,
    type,
    placeholder,
    value,
    onChange,
    error,
    icon: Icon,
    autoComplete,
    testId,
}: LoginFormFieldProps) => {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        error
                            ? "text-error-500"
                            : "text-surface-400 group-focus-within:text-brand-500"
                    )} />
                </div>
                <input
                    id={id}
                    type={type}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    className={cn(
                        "w-full pl-12 pr-4 py-3 text-surface-900 dark:text-surface-50 rounded-xl border-2 transition-all duration-200",
                        "bg-white/50 dark:bg-surface-900/50 backdrop-blur-sm",
                        "placeholder:text-surface-400 dark:placeholder:text-surface-500",
                        "focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500",
                        "hover:bg-white/70 dark:hover:bg-surface-900/70",
                        error
                            ? "border-error-300 focus:border-error-500 focus:ring-error-500/20"
                            : "border-surface-200 dark:border-surface-700 focus:border-brand-500"
                    )}
                    placeholder={placeholder}
                    data-testid={testId}
                />

                {/* Focus indicator */}
                <div className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full",
                    "transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left"
                )} />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-error-600 dark:text-error-400 animate-in slide-in-from-left-2 duration-300">
                    <div className="h-1 w-1 bg-error-500 rounded-full" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}; 