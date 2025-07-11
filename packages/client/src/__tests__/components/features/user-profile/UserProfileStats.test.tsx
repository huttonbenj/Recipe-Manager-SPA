import { render, screen } from '@testing-library/react';
import { UserProfileStats } from '../../../../../src/components/features/user-profile/UserProfileStats';
import { describe, it, expect } from 'vitest';

describe('UserProfileStats', () => {
    it('renders stats section', () => {
        render(
            <UserProfileStats
                stats={{ totalRecipes: 1, totalLikes: 2, totalViews: 3, averageRating: 4.5 }}
            />
        );
        expect(screen.getByText(/recipes/i)).toBeInTheDocument();
    });
}); 