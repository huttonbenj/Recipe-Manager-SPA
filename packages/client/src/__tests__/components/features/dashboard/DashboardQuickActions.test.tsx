import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { DashboardQuickActions } from '../../../../components/features/dashboard/DashboardQuickActions';
import { renderWithProviders } from '../../../utils/test-utils';

describe('DashboardQuickActions', () => {
    it('renders all quick actions', () => {
        renderWithProviders(<DashboardQuickActions />);
        expect(screen.getByText('Create Recipe')).toBeInTheDocument();
        expect(screen.getByText('Browse Recipes')).toBeInTheDocument();
        expect(screen.getByText('Search Recipes')).toBeInTheDocument();
        expect(screen.getByText('Filter Favorites')).toBeInTheDocument();
    });

    it('renders correct links for actions', () => {
        renderWithProviders(<DashboardQuickActions />);
        expect(screen.getByText('Create Recipe').closest('a')).toHaveAttribute('href', '/recipes/new');
        expect(screen.getByText('Browse Recipes').closest('a')).toHaveAttribute('href', '/recipes');
        expect(screen.getByText('Search Recipes').closest('a')).toHaveAttribute('href', '/recipes?view=search');
        expect(screen.getByText('Filter Favorites').closest('a')).toHaveAttribute('href', '/recipes?filter=favorites');
    });

    it('renders action descriptions', () => {
        renderWithProviders(<DashboardQuickActions />);
        expect(screen.getByText('Add a new recipe to your collection')).toBeInTheDocument();
        expect(screen.getByText('Explore recipes from other users')).toBeInTheDocument();
        expect(screen.getByText('Find recipes by ingredients or cuisine')).toBeInTheDocument();
        expect(screen.getByText('View your favorite recipes')).toBeInTheDocument();
    });
}); 