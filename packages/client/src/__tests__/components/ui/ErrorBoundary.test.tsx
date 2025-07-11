import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../utils/test-utils';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary/ErrorBoundary';

const ProblemChild: React.FC = () => {
    throw new Error('Test error');
};

describe('ErrorBoundary', () => {
    it('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <div>Safe content</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Safe content')).toBeInTheDocument();
    });

    it('catches error and renders fallback UI', () => {
        // Suppress error output for this test
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
        spy.mockRestore();
    });

    it('refreshes the page when refresh button is clicked', () => {
        // Mock window.location.reload
        const reload = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { reload },
            writable: true,
        });
        // Suppress error output
        vi.spyOn(console, 'error').mockImplementation(() => { });
        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );
        fireEvent.click(screen.getByRole('button', { name: /refresh page/i }));
        expect(reload).toHaveBeenCalled();
    });
}); 