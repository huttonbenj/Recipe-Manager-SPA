import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';
import { cn } from '../../../../utils/cn';

interface RegisterFormFieldProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    icon: LucideIcon;
    autoComplete?: string;
}

export const RegisterFormField = ({
    id,
    label,
    type,
    placeholder,
    value,
    onChange,
    error,
    icon: Icon,
    autoComplete,
}: RegisterFormFieldProps) => {
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-surface-900 dark:text-surface-100">
                {label}
            </label>
            <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-surface-400 dark:text-surface-500" />
                </div>
                <input
                    id={id}
                    type={type}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    className={cn(
                        "appearance-none relative block w-full px-3 py-2 pl-10 border rounded-md text-surface-900 dark:text-surface-100 bg-white dark:bg-surface-900 focus:z-10 sm:text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2",
                        error
                            ? "border-error-300 placeholder-error-400 focus:ring-error-500 focus:border-error-500 dark:border-error-700 dark:placeholder-error-500"
                            : "border-surface-300 placeholder-surface-500 dark:border-surface-700 dark:placeholder-surface-400"
                    )}
                    style={!error ? {
                        '--tw-ring-color': themeColors.primary,
                        borderColor: undefined
                    } as React.CSSProperties : {}}
                    onFocus={(e) => {
                        if (!error) {
                            e.target.style.borderColor = themeColors.primary;
                            e.target.style.boxShadow = `0 0 0 2px ${themeColors.primary}40`;
                        }
                    }}
                    onBlur={(e) => {
                        if (!error) {
                            e.target.style.borderColor = '';
                            e.target.style.boxShadow = '';
                        }
                    }}
                    placeholder={placeholder}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
            )}
        </div>
    );
}; 