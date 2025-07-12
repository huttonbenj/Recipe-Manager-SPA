import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface LoginFormPasswordFieldProps {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | undefined;
    showPassword: boolean;
    onTogglePassword: () => void;
    autoComplete?: string;
    isFirst?: boolean;
    isLast?: boolean;
    testId?: string;
}

export const LoginFormPasswordField = ({
    id,
    label,
    placeholder,
    value,
    onChange,
    error,
    showPassword,
    onTogglePassword,
    autoComplete,
    isFirst = false,
    isLast = false,
    testId,
}: LoginFormPasswordFieldProps) => {
    const getRoundedClasses = () => {
        if (isFirst && isLast) return 'rounded-md';
        if (isFirst) return 'rounded-t-md';
        if (isLast) return 'rounded-b-md';
        return 'rounded-none';
    };

    return (
        <div>
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-surface-400" />
                </div>
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    className={`appearance-none ${getRoundedClasses()} relative block w-full px-3 py-2 pl-10 pr-10 border ${error
                        ? 'border-red-300 placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'border-surface-300 placeholder-surface-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500'
                        } text-surface-900 dark:text-surface-50 focus:z-10 sm:text-sm`}
                    placeholder={placeholder}
                    data-testid={testId}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={onTogglePassword}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-surface-400" />
                    ) : (
                        <Eye className="h-5 w-5 text-surface-400" />
                    )}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}; 