import { render, screen } from '@testing-library/react';
import { UserProfileHeader } from '../../../../../src/components/features/user-profile/UserProfileHeader';
import { describe, it, expect } from 'vitest';

describe('UserProfileHeader', () => {
    it('renders user name', () => {
        render(
            <UserProfileHeader
                user={{ name: 'Test User', email: 'test@example.com', created_at: new Date() }}
                onEditClick={() => { }}
            />
        );
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });
}); 