import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../../components/ui/Button';

describe('Button Component', () => {
    describe('Basic Rendering', () => {
        it('should render button with text', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
        });

        it('should render button with custom type', () => {
            render(<Button type="submit">Submit</Button>);
            const button = screen.getByRole('button', { name: 'Submit' });
            expect(button).toHaveAttribute('type', 'submit');
        });

        it('should render disabled button', () => {
            render(<Button disabled>Disabled</Button>);
            const button = screen.getByRole('button', { name: 'Disabled' });
            expect(button).toBeDisabled();
        });
    });

    describe('Variants', () => {
        it('should render primary variant', () => {
            render(<Button variant="primary">Primary</Button>);
            const button = screen.getByRole('button', { name: 'Primary' });
            expect(button).toHaveClass('bg-brand-600');
        });

        it('should render secondary variant', () => {
            render(<Button variant="secondary">Secondary</Button>);
            const button = screen.getByRole('button', { name: 'Secondary' });
            expect(button).toHaveClass('bg-surface-200');
        });

        it('should render danger variant', () => {
            render(<Button variant="danger">Danger</Button>);
            const button = screen.getByRole('button', { name: 'Danger' });
            expect(button).toHaveClass('bg-error-600');
        });

        it('should render ghost variant', () => {
            render(<Button variant="ghost">Ghost</Button>);
            const button = screen.getByRole('button', { name: 'Ghost' });
            expect(button).toHaveClass('text-surface-600');
        });
    });

    describe('Sizes', () => {
        it('should render small size', () => {
            render(<Button size="sm">Small</Button>);
            const button = screen.getByRole('button', { name: 'Small' });
            expect(button).toHaveClass('px-3', 'text-xs');
        });

        it('should render medium size (default)', () => {
            render(<Button>Medium</Button>);
            const button = screen.getByRole('button', { name: 'Medium' });
            expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
        });

        it('should render large size', () => {
            render(<Button size="lg">Large</Button>);
            const button = screen.getByRole('button', { name: 'Large' });
            expect(button).toHaveClass('px-6', 'text-base');
        });
    });

    describe('States', () => {
        it('should render loading state', () => {
            render(<Button isLoading>Loading</Button>);
            const button = screen.getByRole('button', { name: 'Loading' });
            expect(button).toBeDisabled();
            expect(button.querySelector('svg')).toBeInTheDocument();
        });

        it('should show loading spinner when loading', () => {
            render(<Button isLoading>Loading</Button>);
            const button = screen.getByRole('button', { name: 'Loading' });
            expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
        });

        it('should not be clickable when loading', () => {
            const handleClick = vi.fn();
            render(<Button isLoading onClick={handleClick}>Loading</Button>);
            const button = screen.getByRole('button', { name: 'Loading' });
            fireEvent.click(button);
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('Icons', () => {
        it('should render with left icon', () => {
            const leftIcon = <span data-testid="left-icon">→</span>;
            render(<Button leftIcon={leftIcon}>With Icon</Button>);
            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        });

        it('should render with right icon', () => {
            const rightIcon = <span data-testid="right-icon">←</span>;
            render(<Button rightIcon={rightIcon}>With Icon</Button>);
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });
    });

    describe('Event Handling', () => {
        it('should handle click events', () => {
            const handleClick = vi.fn();
            render(<Button onClick={handleClick}>Click me</Button>);
            const button = screen.getByRole('button', { name: 'Click me' });
            fireEvent.click(button);
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should not handle click events when disabled', () => {
            const handleClick = vi.fn();
            render(<Button disabled onClick={handleClick}>Disabled</Button>);
            const button = screen.getByRole('button', { name: 'Disabled' });
            fireEvent.click(button);
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('Custom Props', () => {
        it('should accept custom className', () => {
            render(<Button className="custom-class">Custom</Button>);
            const button = screen.getByRole('button', { name: 'Custom' });
            expect(button).toHaveClass('custom-class');
        });

        it('should accept custom data attributes', () => {
            render(<Button data-testid="custom-button">Custom</Button>);
            const button = screen.getByTestId('custom-button');
            expect(button).toBeInTheDocument();
        });

        it('should accept ARIA attributes', () => {
            render(<Button aria-label="Custom label">Button</Button>);
            const button = screen.getByRole('button', { name: 'Custom label' });
            expect(button).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper role', () => {
            render(<Button>Button</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });

        it('should be focusable', () => {
            render(<Button>Button</Button>);
            const button = screen.getByRole('button');
            button.focus();
            expect(button).toHaveFocus();
        });

        it('should not be focusable when disabled', () => {
            render(<Button disabled>Button</Button>);
            const button = screen.getByRole('button');
            button.focus();
            expect(button).not.toHaveFocus();
        });
    });
}); 