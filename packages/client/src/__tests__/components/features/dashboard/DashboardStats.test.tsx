import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { DashboardStats } from '../../../../components/features/dashboard/DashboardStats';

describe('DashboardStats', () => {
    const baseProps = {
        stats: {
            totalRecipes: 5,
            totalLikes: 10,
            averageRating: 4.2,
            totalViews: 100,
        },
        statsLoading: false,
    };

    it('renders all stat cards', () => {
        renderWithProviders(<DashboardStats {...baseProps} />);
        expect(screen.getByText('Your Recipes')).toBeInTheDocument();
        expect(screen.getByText('Total Likes')).toBeInTheDocument();
        expect(screen.getByText('Avg Rating')).toBeInTheDocument();
        expect(screen.getByText('Total Views')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('4.2')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('shows loading skeletons when statsLoading', () => {
        renderWithProviders(<DashboardStats {...baseProps} statsLoading={true} />);
        expect(screen.getAllByText('', { selector: '.animate-pulse' }).length).toBeGreaterThan(0);
    });
}); 