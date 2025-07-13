/**
 * Centralized export file for UI components
 * Makes it easy to import commonly used components throughout the application
 */

// Core UI Components
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Modal } from './Modal';
export { default as Card } from './Card';
// TODO: Implement these missing components
// export { Badge } from './Badge';
// export { Avatar } from './Avatar';
// export { Spinner } from './Spinner';
// export { Toast } from './Toast';
// export { Tooltip } from './Tooltip';
// export { Dropdown } from './Dropdown';
// export { Tabs } from './Tabs';
// export { Pagination } from './Pagination';

// Layout Components
export { default as Loading } from './Loading';
export { default as ErrorBoundary } from './ErrorBoundary';
// TODO: export { ConfirmDialog } from './ConfirmDialog';

// Theme Components
export { ThemeToggle } from './ThemeToggle';
export { ThemeSelector } from './ThemeSelector';

// Component Types
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';
export type { ModalProps } from './Modal';
export type { CardProps } from './Card';
// TODO: Add these types when components are implemented
// export type { TextareaProps } from './Textarea';
// export type { SelectProps } from './Select';
// export type { CheckboxProps } from './Checkbox';
// export type { BadgeProps } from './Badge';
// export type { AvatarProps } from './Avatar';
// export type { SpinnerProps } from './Spinner';
// export type { ToastProps } from './Toast';
// export type { TooltipProps } from './Tooltip';
// export type { DropdownProps } from './Dropdown';
// export type { TabsProps } from './Tabs';
// export type { PaginationProps } from './Pagination';