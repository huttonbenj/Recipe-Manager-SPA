import React from 'react';
import { cn } from '../../../utils/cn';

// Form Field Wrapper
export interface FormFieldProps {
    label?: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    required,
    children,
    className,
}) => {
    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    error,
    leftIcon,
    rightIcon,
    className,
    ...props
}) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
    const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500';

    const classes = cn(
        baseClasses,
        errorClasses,
        leftIcon ? 'pl-10' : '',
        rightIcon ? 'pr-10' : '',
        className
    );

    if (leftIcon || rightIcon) {
        return (
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {leftIcon}
                    </div>
                )}
                <input className={classes} {...props} />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        {rightIcon}
                    </div>
                )}
            </div>
        );
    }

    return <input className={classes} {...props} />;
};

// TextArea Component
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
    error,
    className,
    ...props
}) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-vertical';
    const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500';

    const classes = cn(baseClasses, errorClasses, className);

    return <textarea className={classes} {...props} />;
};

// Select Component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    error,
    options,
    placeholder,
    className,
    ...props
}) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white';
    const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500';

    const classes = cn(baseClasses, errorClasses, className);

    return (
        <select className={classes} {...props}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}; 