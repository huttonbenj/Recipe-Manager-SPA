import { render, screen } from '@testing-library/react';
import { UserProfileActivity } from '../../../../../src/components/features/user-profile/UserProfileActivity';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe('UserProfileActivity', () => {
    it('renders activity section', () => {
        render(
            <UserProfileActivity
                user={{ name: 'Test User', created_at: new Date() }}
                totalRecipes={0}
            />, { wrapper: MemoryRouter }
        );
        expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
    });
}); 