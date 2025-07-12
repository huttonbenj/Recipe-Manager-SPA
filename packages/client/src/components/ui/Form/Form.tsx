import React, { forwardRef, useState, useId } from 'react';
import { cn } from '../../../utils/cn';
import { Eye, EyeOff, Loader2, ChevronDown } from 'lucide-react';

// Input Component
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    error?: string;
    success?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'filled' | 'ghost' | 'floating';
    rounded?: 'sm' | 'md' | 'lg' | 'full';
    loading?: boolean;
    onClear?: () => void;
    showClear?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    error,
    success,
    leftIcon,
    rightIcon,
    size = 'md',
    variant = 'default',
    rounded = 'md',
    loading = false,
    onClear,
    showClear = false,
    className,
    type = 'text',
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const inputId = useId();
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const sizeStyles = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
    };

    const roundedStyles = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const variantStyles = {
        default: 'border border-surface-300 bg-white dark:border-surface-700 dark:bg-surface-900',
        filled: 'border-0 bg-surface-100 dark:bg-surface-800',
        ghost: 'border-0 bg-transparent hover:bg-surface-50 dark:hover:bg-surface-900',
        floating: 'border border-surface-300 bg-white dark:border-surface-700 dark:bg-surface-900',
    };

    const stateStyles = error
        ? 'border-error-300 focus:border-error-500 focus:ring-error-500 dark:border-error-700 dark:focus:border-error-500'
        : success
            ? 'border-success-300 focus:border-success-500 focus:ring-success-500 dark:border-success-700 dark:focus:border-success-500'
            : 'focus:border-brand-500 focus:ring-brand-500 dark:focus:border-brand-500';

    const baseClasses = cn(
        'w-full transition-all duration-200 placeholder:text-surface-400 dark:placeholder:text-surface-500',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'dark:text-surface-50 text-surface-900',
        sizeStyles[size],
        roundedStyles[rounded],
        variantStyles[variant],
        stateStyles,
        leftIcon && 'pl-10',
        (rightIcon || isPassword || showClear || loading) && 'pr-10',
        variant === 'floating' && 'placeholder-transparent',
        className
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(!!e.target.value);
        props.onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        props.onBlur?.(e);
    };

    const WrapperComponent = variant === 'floating' ? 'div' : React.Fragment;
    const wrapperProps = variant === 'floating' ? { className: 'relative' } : {};

    return (
        <WrapperComponent {...wrapperProps}>
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400 dark:text-surface-500">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    type={inputType}
                    className={baseClasses}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    {...props}
                />
                {variant === 'floating' && props.placeholder && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            'absolute left-3 transition-all duration-200 pointer-events-none',
                            'text-surface-400 dark:text-surface-500',
                            (isFocused || hasValue)
                                ? 'top-2 text-xs font-medium -translate-y-1'
                                : 'top-1/2 text-sm -translate-y-1/2'
                        )}
                    >
                        {props.placeholder}
                    </label>
                )}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {loading && (
                        <Loader2 className="w-4 h-4 animate-spin text-surface-400 dark:text-surface-500" />
                    )}
                    {!loading && showClear && hasValue && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    {!loading && !showClear && isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    )}
                    {!loading && !showClear && !isPassword && rightIcon && (
                        <span className="text-surface-400 dark:text-surface-500">
                            {rightIcon}
                        </span>
                    )}
                </div>
            </div>
        </WrapperComponent>
    );
});

// TextArea Component
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    success?: string;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    size?: 'sm' | 'md' | 'lg';
    rounded?: 'sm' | 'md' | 'lg';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    error,
    success,
    resize = 'vertical',
    size = 'md',
    rounded = 'md',
    className,
    ...props
}, ref) => {
    const sizeStyles = {
        sm: 'p-3 text-sm',
        md: 'p-4 text-sm',
        lg: 'p-6 text-base',
    };

    const roundedStyles = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
    };

    const resizeStyles = {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
    };

    const stateStyles = error
        ? 'border-error-300 focus:border-error-500 focus:ring-error-500 dark:border-error-700'
        : success
            ? 'border-success-300 focus:border-success-500 focus:ring-success-500 dark:border-success-700'
            : 'border-surface-300 focus:border-brand-500 focus:ring-brand-500 dark:border-surface-700';

    const baseClasses = cn(
        'w-full transition-all duration-200 placeholder:text-surface-400 dark:placeholder:text-surface-500',
        'border bg-white dark:bg-surface-900 dark:text-surface-50 text-surface-900',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        roundedStyles[rounded],
        resizeStyles[resize],
        stateStyles,
        className
    );

    return <textarea ref={ref} className={baseClasses} {...props} />;
});

// Select Component
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    error?: string;
    success?: string;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    error,
    success,
    options,
    placeholder,
    size = 'md',
    rounded = 'md',
    className,
    ...props
}, ref) => {
    const sizeStyles = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
    };

    const roundedStyles = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const stateStyles = error
        ? 'border-error-300 focus:border-error-500 focus:ring-error-500 dark:border-error-700'
        : success
            ? 'border-success-300 focus:border-success-500 focus:ring-success-500 dark:border-success-700'
            : 'border-surface-300 focus:border-brand-500 focus:ring-brand-500 dark:border-surface-700';

    const baseClasses = cn(
        'w-full transition-all duration-200 appearance-none cursor-pointer',
        'border bg-white dark:bg-surface-900 dark:text-surface-50 text-surface-900',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        roundedStyles[rounded],
        stateStyles,
        'pr-10',
        className
    );

    return (
        <div className="relative">
            <select ref={ref} className={baseClasses} {...props}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-surface-400 dark:text-surface-500" />
            </div>
        </div>
    );
});

// Checkbox Component
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: React.ReactNode;
    description?: string;
    error?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'card';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
    label,
    description,
    error,
    size = 'md',
    variant = 'default',
    className,
    ...props
}, ref) => {
    const inputId = useId();

    const sizeStyles = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const textSizeStyles = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const checkboxClasses = cn(
        'rounded border-surface-300 text-brand-600 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-900',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        error && 'border-error-300 focus:ring-error-500 dark:border-error-600'
    );

    const containerClasses = cn(
        'flex items-start space-x-3',
        variant === 'card' && 'p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer',
        className
    );

    return (
        <div className={containerClasses}>
            <input
                ref={ref}
                id={inputId}
                type="checkbox"
                className={checkboxClasses}
                {...props}
            />
            <div className="flex-1 min-w-0">
                {label && (
                    <label htmlFor={inputId} className={cn(
                        'font-medium text-surface-900 dark:text-surface-100 cursor-pointer',
                        textSizeStyles[size],
                        props.disabled && 'opacity-50 cursor-not-allowed'
                    )}>
                        {label}
                    </label>
                )}
                {description && (
                    <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                        {description}
                    </p>
                )}
                {error && (
                    <p className="text-sm text-error-600 dark:text-error-400 mt-1">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
});

// Radio Component
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: React.ReactNode;
    description?: string;
    error?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'card';
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
    label,
    description,
    error,
    size = 'md',
    variant = 'default',
    className,
    ...props
}, ref) => {
    const inputId = useId();

    const sizeStyles = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const textSizeStyles = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const radioClasses = cn(
        'border-surface-300 text-brand-600 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-900',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        error && 'border-error-300 focus:ring-error-500 dark:border-error-600'
    );

    const containerClasses = cn(
        'flex items-start space-x-3',
        variant === 'card' && 'p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer',
        className
    );

    return (
        <div className={containerClasses}>
            <input
                ref={ref}
                id={inputId}
                type="radio"
                className={radioClasses}
                {...props}
            />
            <div className="flex-1 min-w-0">
                {label && (
                    <label htmlFor={inputId} className={cn(
                        'font-medium text-surface-900 dark:text-surface-100 cursor-pointer',
                        textSizeStyles[size],
                        props.disabled && 'opacity-50 cursor-not-allowed'
                    )}>
                        {label}
                    </label>
                )}
                {description && (
                    <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                        {description}
                    </p>
                )}
                {error && (
                    <p className="text-sm text-error-600 dark:text-error-400 mt-1">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
});

// Switch Component
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: React.ReactNode;
    description?: string;
    error?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
    label,
    description,
    error,
    size = 'md',
    className,
    ...props
}, ref) => {
    const inputId = useId();

    const sizeStyles = {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-12',
    };

    const thumbSizeStyles = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const textSizeStyles = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <div className={cn('flex items-start space-x-3', className)}>
            <div className="flex-shrink-0">
                <label htmlFor={inputId} className="relative inline-flex cursor-pointer">
                    <input
                        ref={ref}
                        id={inputId}
                        type="checkbox"
                        className="sr-only"
                        {...props}
                    />
                    <div className={cn(
                        'relative transition-colors duration-200 ease-in-out rounded-full',
                        'bg-surface-200 dark:bg-surface-700',
                        'focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-surface-900',
                        'peer-checked:bg-brand-500',
                        'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
                        sizeStyles[size],
                        error && 'focus-within:ring-error-500'
                    )}>
                        <div className={cn(
                            'absolute left-0.5 top-0.5 transition-transform duration-200 ease-in-out',
                            'bg-white dark:bg-surface-100 rounded-full shadow-md',
                            'peer-checked:translate-x-4',
                            thumbSizeStyles[size],
                            size === 'sm' && 'peer-checked:translate-x-4',
                            size === 'md' && 'peer-checked:translate-x-5',
                            size === 'lg' && 'peer-checked:translate-x-5'
                        )} />
                    </div>
                </label>
            </div>
            <div className="flex-1 min-w-0">
                {label && (
                    <label htmlFor={inputId} className={cn(
                        'font-medium text-surface-900 dark:text-surface-100 cursor-pointer',
                        textSizeStyles[size],
                        props.disabled && 'opacity-50 cursor-not-allowed'
                    )}>
                        {label}
                    </label>
                )}
                {description && (
                    <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                        {description}
                    </p>
                )}
                {error && (
                    <p className="text-sm text-error-600 dark:text-error-400 mt-1">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
});

// Add display names for better debugging
Input.displayName = 'Input';
TextArea.displayName = 'TextArea';
Select.displayName = 'Select';
Checkbox.displayName = 'Checkbox';
Radio.displayName = 'Radio';
Switch.displayName = 'Switch'; 