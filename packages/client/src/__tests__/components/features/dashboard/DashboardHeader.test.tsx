import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { DashboardHeader } from '../../../../components/features/dashboard/DashboardHeader';

describe('DashboardHeader', () => {
    const baseProps = {
        greeting: 'Hello',
        userName: 'Test User',
        stats: { totalRecipes: 5, totalLikes: 10 },
        statsLoading: false,
    };

    it('renders greeting and user name', () => {
        renderWithProviders(<DashboardHeader {...baseProps} />);
        expect(screen.getByText(/hello, test user/i)).toBeInTheDocument();
    });

    it('renders stats when not loading', () => {
        renderWithProviders(<DashboardHeader {...baseProps} />);
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('Recipes')).toBeInTheDocument();
        expect(screen.getByText('Likes')).toBeInTheDocument();
    });

    it('shows loading skeletons when statsLoading', () => {
        renderWithProviders(<DashboardHeader {...baseProps} statsLoading={true} />);
        expect(screen.getAllByText('', { selector: '.animate-pulse' }).length).toBeGreaterThan(0);
    });
}); 