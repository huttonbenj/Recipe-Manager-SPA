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
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    className={`appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border ${error
                        ? 'border-red-300 placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                        } rounded-md text-gray-900 focus:z-10 sm:text-sm`}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={onTogglePassword}
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                    )}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}; 