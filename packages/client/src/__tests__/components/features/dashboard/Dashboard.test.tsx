import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
vi.mock('../../../../hooks', () => {
    const mockUseDashboard = vi.fn();
    globalThis.mockUseDashboard = mockUseDashboard;
    return { useDashboard: mockUseDashboard };
});
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { Dashboard } from '../../../../components/features/dashboard/Dashboard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
    // eslint-disable-next-line no-var
    var mockUseDashboard: Mock;
}


describe('Dashboard', () => {
    beforeEach(() => {
        globalThis.mockUseDashboard.mockReset();
        globalThis.mockUseDashboard.mockReturnValue({
            greeting: 'Hello',
            stats: { totalRecipes: 5, totalLikes: 10, averageRating: 4.2, totalViews: 100 },
            statsLoading: false,
            recentRecipes: [
                {
                    id: '1',
                    user_id: 'user-id',
                    title: 'Community Recipe',
                    image_url: '',
                    cook_time: 25,
                    difficulty: 'Medium' as const,
                    category: 'Dessert',
                    servings: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                    user: { id: 'user-id', name: 'Bob', email: 'bob@example.com' },
                    ingredients: '[]',
                    instructions: '[]',
                    tags: '[]',
                },
            ],
            recentRecipesLoading: false,
            userRecipes: [
                {
                    id: '2',
                    user_id: 'user-id',
                    title: 'My Recipe',
                    image_url: '',
                    cook_time: 30,
                    difficulty: 'Easy' as const,
                    category: 'Main Course',
                    servings: 4,
                    created_at: new Date(),
                    updated_at: new Date(),
                    user: { id: 'user-id', name: 'Alice', email: 'alice@example.com' },
                    ingredients: '[]',
                    instructions: '[]',
                    tags: '[]',
                },
            ],
            userRecipesLoading: false,
            user: { id: 'user-id', name: 'Alice', email: 'alice@example.com' },
        });
    });

    it('renders all dashboard sections and passes props', () => {
        renderWithProviders(<Dashboard />);
        expect(screen.getByText(/hello, alice/i)).toBeInTheDocument();
        expect(screen.getAllByText('5').length).toBeGreaterThan(1); // totalRecipes appears in multiple places
        expect(screen.getAllByText('10').length).toBeGreaterThan(0); // totalLikes
        expect(screen.getByText('My Recipe')).toBeInTheDocument();
        expect(screen.getByText('Community Recipe')).toBeInTheDocument();
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
        expect(screen.getByText('Recent Community Recipes')).toBeInTheDocument();
        expect(screen.getByText('Your Recent Recipes')).toBeInTheDocument();
    });

    it('shows loading skeletons when loading', () => {
        globalThis.mockUseDashboard.mockImplementationOnce(() => ({
            greeting: 'Hello',
            stats: { totalRecipes: 0, totalLikes: 0, averageRating: 0, totalViews: 0 },
            statsLoading: true,
            recentRecipes: [],
            recentRecipesLoading: true,
            userRecipes: [],
            userRecipesLoading: true,
            user: { id: 'user-id', name: 'Alice', email: 'alice@example.com' },
        }));
        renderWithProviders(<Dashboard />);
        expect(screen.getAllByText('', { selector: '.animate-pulse' }).length).toBeGreaterThan(0);
    });
}); 