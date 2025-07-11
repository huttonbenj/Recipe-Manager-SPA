import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from '../../../components/app/Layout';

// Mock Navigation component
vi.mock('../../../components/features/navigation', () => ({
    Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}));

describe('Layout', () => {
    it('renders navigation and children', () => {
        render(
            <Layout>
                <div data-testid="test-content">Test Content</div>
            </Layout>
        );

        expect(screen.getByTestId('navigation')).toBeInTheDocument();
        expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
        const { container } = render(
            <Layout>
                <div>Content</div>
            </Layout>
        );

        const outerDiv = container.firstChild as HTMLElement;
        expect(outerDiv).toHaveClass('min-h-screen', 'bg-gray-50');

        const main = screen.getByRole('main');
        expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8');
    });

    it('renders multiple children correctly', () => {
        render(
            <Layout>
                <div data-testid="child-1">Child 1</div>
                <div data-testid="child-2">Child 2</div>
            </Layout>
        );

        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
}); 