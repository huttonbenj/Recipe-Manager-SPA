import React from 'react';
import { cn } from '../../../utils/cn';
import { AlertCircle, CheckCircle } from 'lucide-react';

export interface FormFieldProps {
    label?: React.ReactNode;
    error?: string;
    success?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
    description?: string;
    disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    success,
    required,
    children,
    className,
    description,
    disabled,
}) => {
    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <label className={cn(
                    "block text-sm font-medium text-surface-900 dark:text-surface-100 transition-colors",
                    disabled && "opacity-50"
                )}>
                    {label}
                    {required && <span className="text-error-500 ml-1">*</span>}
                </label>
            )}
            {description && (
                <p className="text-sm text-surface-600 dark:text-surface-400">
                    {description}
                </p>
            )}
            {children}
            {error && (
                <div className="flex items-center space-x-2 text-error-600 dark:text-error-400">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
            {success && (
                <div className="flex items-center space-x-2 text-success-600 dark:text-success-400">
                    <CheckCircle className="w-4 h-4" />
                    <p className="text-sm">{success}</p>
                </div>
            )}
        </div>
    );
}; 