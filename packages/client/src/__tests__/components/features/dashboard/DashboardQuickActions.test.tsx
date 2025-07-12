
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { DashboardQuickActions } from '../../../../components/features/dashboard/DashboardQuickActions';
import { renderWithProviders } from '../../../utils/test-utils';

describe('DashboardQuickActions', () => {
    it('renders all quick actions', () => {
        renderWithProviders(<DashboardQuickActions />);
        expect(screen.getByText('Create Recipe')).toBeInTheDocument();
        expect(screen.getByText('Browse Recipes')).toBeInTheDocument();
        expect(screen.getByText('My Recipes')).toBeInTheDocument();
        expect(screen.getByText('Favorites')).toBeInTheDocument();
        expect(screen.getByText('Saved Recipes')).toBeInTheDocument();
        expect(screen.getByText('Quick & Easy')).toBeInTheDocument();
        expect(screen.getByText('Easy Recipes')).toBeInTheDocument();
        expect(screen.getByText('Popular Now')).toBeInTheDocument();
    });

    it('renders correct links for actions', () => {
        renderWithProviders(<DashboardQuickActions />);
        expect(screen.getByText('Create Recipe').closest('a')).toHaveAttribute('href', '/recipes/new');
        expect(screen.getByText('Browse Recipes').closest('a')).toHaveAttribute('href', '/recipes');
        expect(screen.getByText('My Recipes').closest('a')).toHaveAttribute('href', '/recipes?user_id=current');
        expect(screen.getByText('Favorites').closest('a')).toHaveAttribute('href', '/recipes?liked=true');
        expect(screen.getByText('Saved Recipes').closest('a')).toHaveAttribute('href', '/recipes?saved=true');
        expect(screen.getByText('Quick & Easy').closest('a')).toHaveAttribute('href', '/recipes?cookTime=30&quickFilter=quick');
        expect(screen.getByText('Easy Recipes').closest('a')).toHaveAttribute('href', '/recipes?difficulty=Easy&quickFilter=easy');
        expect(screen.getByText('Popular Now').closest('a')).toHaveAttribute('href', '/recipes?sortBy=likes&sortOrder=desc&quickFilter=popular');
    });

    it('renders action descriptions', () => {
        renderWithProviders(<DashboardQuickActions />);
        expect(screen.getByText('Add a new recipe to your collection')).toBeInTheDocument();
        expect(screen.getByText('Explore recipes from other users')).toBeInTheDocument();
        expect(screen.getByText('View and manage your recipes')).toBeInTheDocument();
        expect(screen.getByText('Your liked recipes')).toBeInTheDocument();
        expect(screen.getByText('Recipes you saved for later')).toBeInTheDocument();
        expect(screen.getByText('Recipes under 30 minutes')).toBeInTheDocument();
        expect(screen.getByText('Simple recipes for beginners')).toBeInTheDocument();
        expect(screen.getByText('Most liked recipes')).toBeInTheDocument();
    });
}); 