import React from 'react';
import { LucideIcon } from 'lucide-react';

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
    isFirst = false,
    isLast = false,
    testId,
}: LoginFormFieldProps) => {
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
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    id={id}
                    type={type}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    className={`appearance-none ${getRoundedClasses()} relative block w-full px-3 py-2 pl-10 border ${error
                        ? 'border-red-300 placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                        } text-gray-900 focus:z-10 sm:text-sm`}
                    placeholder={placeholder}
                    data-testid={testId}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}; 