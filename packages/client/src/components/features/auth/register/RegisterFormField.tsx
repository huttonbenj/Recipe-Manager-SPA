import React from 'react';
import { LucideIcon } from 'lucide-react';

interface RegisterFormFieldProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | undefined;
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
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    id={id}
                    type={type}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${error
                        ? 'border-red-300 placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                        } rounded-md text-gray-900 focus:z-10 sm:text-sm`}
                    placeholder={placeholder}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}; 