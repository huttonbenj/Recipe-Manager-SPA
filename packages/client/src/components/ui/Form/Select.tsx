import React from 'react';
import { cn } from '../../../utils/cn';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    error?: string;
}

export const Select: React.FC<SelectProps> = ({ id, error, className, options = [], ...props }) => {
    return (
        <div className="w-full">
            <select
                id={id}
                className={cn(
                    "w-full bg-surface-800 border-surface-700 text-surface-900 dark:text-surface-100 placeholder-surface-500",
                    "rounded-md shadow-sm px-4 py-2 border transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
                    error && "border-red-500",
                    className
                )}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}; 