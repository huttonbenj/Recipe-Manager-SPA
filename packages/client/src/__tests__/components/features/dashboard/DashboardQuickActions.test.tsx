import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { DashboardQuickActions } from '../../../../components/features/dashboard/DashboardQuickActions';

describe('DashboardQuickActions', () => {
    it('renders all quick actions', () => {
        renderWithProviders(<DashboardQuickActions />);
        expect(screen.getByText('Add New Recipe')).toBeInTheDocument();
        expect(screen.getByText('Browse Recipes')).toBeInTheDocument();
        expect(screen.getByText('Search Recipes')).toBeInTheDocument();
    });

    it('renders correct links for actions', () => {
        renderWithProviders(<DashboardQuickActions />);
        expect(screen.getByText('Add New Recipe').closest('a')).toHaveAttribute('href', '/recipes/new');
        expect(screen.getByText('Browse Recipes').closest('a')).toHaveAttribute('href', '/recipes');
        expect(screen.getByText('Search Recipes').closest('a')).toHaveAttribute('href', '/recipes');
    });
}); 