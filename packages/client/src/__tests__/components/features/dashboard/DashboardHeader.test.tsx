import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import { DashboardHeader } from '../../../../components/features/dashboard/DashboardHeader';

describe('DashboardHeader', () => {
    const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date()
    };

    it('renders greeting and user name', () => {
        renderWithProviders(<DashboardHeader user={mockUser} />);
        expect(screen.getByText(/good (morning|afternoon|evening)/i)).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('renders default user name when no user provided', () => {
        renderWithProviders(<DashboardHeader user={null} />);
        expect(screen.getByText('Chef')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
        renderWithProviders(<DashboardHeader user={mockUser} />);
        expect(screen.getByText('New Recipe')).toBeInTheDocument();
        expect(screen.getByText('Explore')).toBeInTheDocument();
    });

    it('renders correct links for action buttons', () => {
        renderWithProviders(<DashboardHeader user={mockUser} />);
        expect(screen.getByText('New Recipe').closest('a')).toHaveAttribute('href', '/recipes/new');
        expect(screen.getByText('Explore').closest('a')).toHaveAttribute('href', '/recipes');
    });

    it('renders formatted date', () => {
        renderWithProviders(<DashboardHeader user={mockUser} />);
        // Check for date format like "Monday, January 1"
        expect(screen.getByText(/\w+, \w+ \d+/)).toBeInTheDocument();
    });

    it('renders chef icon', () => {
        renderWithProviders(<DashboardHeader user={mockUser} />);
        // Check for the chef hat icon (lucide-react renders as svg)
        expect(document.querySelector('svg')).toBeInTheDocument();
    });
}); 