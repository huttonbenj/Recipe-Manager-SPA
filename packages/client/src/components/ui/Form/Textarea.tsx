import React from 'react';
import { cn } from '../../../utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string | undefined;
}

export const Textarea: React.FC<TextareaProps> = ({ id, label, error, className, ...props }) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium text-surface-300 mb-2">
                {label}
            </label>
            <textarea
                id={id}
                className={cn(
                    "w-full bg-surface-800 border-surface-700 text-white placeholder-surface-500",
                    "rounded-md shadow-sm px-4 py-2 border transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
                    error && "border-red-500",
                    className
                )}
                {...props}
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}; 