import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface RegisterFormPasswordFieldProps {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | undefined;
    showPassword: boolean;
    onTogglePassword: () => void;
    autoComplete?: string;
}

export const RegisterFormPasswordField = ({
    id,
    label,
    placeholder,
    value,
    onChange,
    error,
    showPassword,
    onTogglePassword,
    autoComplete,
}: RegisterFormPasswordFieldProps) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-surface-900 dark:text-surface-100">
                {label}
            </label>
            <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-surface-400 dark:text-surface-500" />
                </div>
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    className={`appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border ${error
                        ? 'border-error-300 placeholder-error-400 focus:outline-none focus:ring-error-500 focus:border-error-500 dark:border-error-700 dark:placeholder-error-500'
                        : 'border-surface-300 placeholder-surface-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500 dark:border-surface-700 dark:placeholder-surface-400'
                        } rounded-md text-surface-900 dark:text-surface-100 bg-white dark:bg-surface-900 focus:z-10 sm:text-sm`}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300"
                    onClick={onTogglePassword}
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
            )}
        </div>
    );
}; 