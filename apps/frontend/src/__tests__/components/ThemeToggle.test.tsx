import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { ThemeProvider } from '../../context/ThemeContext';

/**
 * Test wrapper component that provides theme context
 */
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider>
        {children}
    </ThemeProvider>
);

describe('ThemeToggle', () => {
    it('renders icon variant by default', () => {
        render(
            <ThemeWrapper>
                <ThemeToggle />
            </ThemeWrapper>
        );

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label');
    });

    it('renders button variant when specified', () => {
        render(
            <ThemeWrapper>
                <ThemeToggle variant="button" />
            </ThemeWrapper>
        );

        const button = screen.getByRole('button');
        const text = screen.getByText(/light|dark|system/i);
        expect(button).toBeInTheDocument();
        expect(text).toBeInTheDocument();
    });

    it('displays correct icon for light mode', () => {
        render(
            <ThemeWrapper>
                <ThemeToggle />
            </ThemeWrapper>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('title', expect.stringContaining('dark mode'));
    });

    it('toggles theme mode when clicked', () => {
        render(
            <ThemeWrapper>
                <ThemeToggle />
            </ThemeWrapper>
        );

        const button = screen.getByRole('button');

        // Initial state should be system (default)
        expect(button).toHaveAttribute('title', expect.stringContaining('light mode'));

        // Click to toggle
        fireEvent.click(button);

        // Should now show light mode tooltip
        expect(button).toHaveAttribute('title', expect.stringContaining('dark mode'));
    });

    it('applies custom className', () => {
        render(
            <ThemeWrapper>
                <ThemeToggle className="custom-class" />
            </ThemeWrapper>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('applies different sizes correctly', () => {
        const { rerender } = render(
            <ThemeWrapper>
                <ThemeToggle size="sm" />
            </ThemeWrapper>
        );

        let button = screen.getByRole('button');
        expect(button).toHaveClass('w-8', 'h-8');

        rerender(
            <ThemeWrapper>
                <ThemeToggle size="lg" />
            </ThemeWrapper>
        );

        button = screen.getByRole('button');
        expect(button).toHaveClass('w-12', 'h-12');
    });

    it('has proper accessibility attributes', () => {
        render(
            <ThemeWrapper>
                <ThemeToggle />
            </ThemeWrapper>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('title');
    });
}); 