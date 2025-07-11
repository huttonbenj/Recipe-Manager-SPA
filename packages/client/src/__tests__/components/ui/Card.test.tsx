import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/Card';

describe('Card Component', () => {
    describe('Basic Rendering', () => {
        it('should render card with content', () => {
            render(<Card>Card Content</Card>);
            expect(screen.getByText('Card Content')).toBeInTheDocument();
        });

        it('should render card with header', () => {
            render(
                <Card>
                    <CardHeader>Card Header</CardHeader>
                    <CardContent>Content</CardContent>
                </Card>
            );
            expect(screen.getByText('Card Header')).toBeInTheDocument();
            expect(screen.getByText('Content')).toBeInTheDocument();
        });

        it('should render card with footer', () => {
            render(
                <Card>
                    <CardContent>Content</CardContent>
                    <CardFooter>Card Footer</CardFooter>
                </Card>
            );
            expect(screen.getByText('Card Footer')).toBeInTheDocument();
            expect(screen.getByText('Content')).toBeInTheDocument();
        });

        it('should render card with header and footer', () => {
            render(
                <Card>
                    <CardHeader>Header</CardHeader>
                    <CardContent>Content</CardContent>
                    <CardFooter>Footer</CardFooter>
                </Card>
            );
            expect(screen.getByText('Header')).toBeInTheDocument();
            expect(screen.getByText('Content')).toBeInTheDocument();
            expect(screen.getByText('Footer')).toBeInTheDocument();
        });
    });

    describe('Variants', () => {
        it('should render default variant', () => {
            render(<Card data-testid="card">Default Card</Card>);
            const card = screen.getByTestId('card');
            expect(card).toHaveClass('bg-white', 'shadow-md');
        });

        it('should render outlined variant', () => {
            render(<Card variant="outlined" data-testid="card">Outlined Card</Card>);
            const card = screen.getByTestId('card');
            expect(card).toHaveClass('bg-white', 'border', 'border-gray-200');
        });

        it('should render elevated variant', () => {
            render(<Card variant="elevated" data-testid="card">Elevated Card</Card>);
            const card = screen.getByTestId('card');
            expect(card).toHaveClass('bg-white', 'shadow-lg');
        });
    });

    describe('Padding', () => {
        it('should render with no padding', () => {
            render(<Card padding="none" data-testid="card">No Padding</Card>);
            const card = screen.getByTestId('card');
            expect(card).not.toHaveClass('p-3', 'p-4', 'p-6');
        });

        it('should render with small padding', () => {
            render(<Card padding="sm" data-testid="card">Small Padding</Card>);
            const card = screen.getByTestId('card');
            expect(card).toHaveClass('p-3');
        });

        it('should render with medium padding (default)', () => {
            render(<Card data-testid="card">Medium Padding</Card>);
            const card = screen.getByTestId('card');
            expect(card).toHaveClass('p-4');
        });

        it('should render with large padding', () => {
            render(<Card padding="lg" data-testid="card">Large Padding</Card>);
            const card = screen.getByTestId('card');
            expect(card).toHaveClass('p-6');
        });
    });

    describe('Interactive Features', () => {
        it('should handle click events', () => {
            const handleClick = vi.fn();
            render(<Card onClick={handleClick} data-testid="card">Clickable Card</Card>);
            const card = screen.getByTestId('card');
            fireEvent.click(card);
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should handle hover events', () => {
            const handleMouseEnter = vi.fn();
            const handleMouseLeave = vi.fn();
            render(
                <Card
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    data-testid="card"
                >
                    Hoverable Card
                </Card>
            );

            const card = screen.getByTestId('card');
            fireEvent.mouseEnter(card);
            expect(handleMouseEnter).toHaveBeenCalledTimes(1);

            fireEvent.mouseLeave(card);
            expect(handleMouseLeave).toHaveBeenCalledTimes(1);
        });
    });

    describe('Custom Props', () => {
        it('should accept custom className', () => {
            render(<Card className="custom-class" data-testid="card">Custom Card</Card>);
            const card = screen.getByTestId('card');
            expect(card).toHaveClass('custom-class');
        });

        it('should accept custom data attributes', () => {
            render(<Card data-testid="custom-card">Custom Card</Card>);
            const card = screen.getByTestId('custom-card');
            expect(card).toBeInTheDocument();
        });

        it('should accept ARIA attributes', () => {
            render(<Card aria-label="Custom label" data-testid="card">Card</Card>);
            const card = screen.getByTestId('card');
            expect(card).toHaveAttribute('aria-label', 'Custom label');
        });
    });

    describe('CardHeader', () => {
        it('should render header with proper styling', () => {
            render(<CardHeader data-testid="header">Header</CardHeader>);
            const header = screen.getByTestId('header');
            expect(header).toHaveClass('border-b', 'border-gray-200', 'pb-3', 'mb-4');
        });

        it('should accept custom className', () => {
            render(<CardHeader className="custom-header" data-testid="header">Header</CardHeader>);
            const header = screen.getByTestId('header');
            expect(header).toHaveClass('custom-header');
        });
    });

    describe('CardContent', () => {
        it('should render content', () => {
            render(<CardContent data-testid="content">Content</CardContent>);
            const content = screen.getByTestId('content');
            expect(content).toBeInTheDocument();
        });

        it('should accept custom className', () => {
            render(<CardContent className="custom-content" data-testid="content">Content</CardContent>);
            const content = screen.getByTestId('content');
            expect(content).toHaveClass('custom-content');
        });
    });

    describe('CardFooter', () => {
        it('should render footer with proper styling', () => {
            render(<CardFooter data-testid="footer">Footer</CardFooter>);
            const footer = screen.getByTestId('footer');
            expect(footer).toHaveClass('border-t', 'border-gray-200', 'pt-3', 'mt-4');
        });

        it('should accept custom className', () => {
            render(<CardFooter className="custom-footer" data-testid="footer">Footer</CardFooter>);
            const footer = screen.getByTestId('footer');
            expect(footer).toHaveClass('custom-footer');
        });
    });

    describe('Composition', () => {
        it('should render complex card structure', () => {
            render(
                <Card data-testid="card">
                    <CardHeader><h2>Complex Header</h2></CardHeader>
                    <CardContent>
                        <p>Card content with multiple elements</p>
                        <button>Action Button</button>
                    </CardContent>
                    <CardFooter>
                        <span>Footer content</span>
                    </CardFooter>
                </Card>
            );

            expect(screen.getByText('Complex Header')).toBeInTheDocument();
            expect(screen.getByText('Card content with multiple elements')).toBeInTheDocument();
            expect(screen.getByText('Action Button')).toBeInTheDocument();
            expect(screen.getByText('Footer content')).toBeInTheDocument();
        });
    });
}); 