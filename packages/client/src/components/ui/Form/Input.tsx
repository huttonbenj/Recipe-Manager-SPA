import React from 'react';
import { cn } from '../../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ id, label, error, className, rightIcon, ...props }) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium text-surface-300 mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    className={cn(
                        "w-full bg-surface-800 border-surface-700 text-white placeholder-surface-500",
                        "rounded-md shadow-sm px-4 py-2 border transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
                        rightIcon && "pr-10",
                        error && "border-red-500",
                        className
                    )}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}; 