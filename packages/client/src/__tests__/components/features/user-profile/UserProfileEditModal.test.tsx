import { render, screen } from '@testing-library/react';
import { UserProfileEditModal } from '../../../../../src/components/features/user-profile/UserProfileEditModal';
import { describe, it, expect } from 'vitest';

describe('UserProfileEditModal', () => {
    it('renders modal with form', () => {
        render(
            <UserProfileEditModal
                isOpen={true}
                formData={{ name: 'Test User', email: 'test@example.com' }}
                isLoading={false}
                onSubmit={() => { }}
                onCancel={() => { }}
                onFormDataChange={() => { }}
            />
        );
        expect(screen.getByText(/name/i)).toBeInTheDocument();
    });
}); 