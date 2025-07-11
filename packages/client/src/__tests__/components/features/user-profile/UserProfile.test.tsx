import { render, screen } from '@testing-library/react';
import { UserProfile } from '../../../../../src/components/features/user-profile/UserProfile';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthContext } from '../../../../../src/contexts/AuthContext';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockUser = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
};

const mockStats = {
    totalRecipes: 5,
    recipesByCategory: [
        { category: 'main', count: 3 },
        { category: 'dessert', count: 2 },
    ],
    recipesByDifficulty: [
        { difficulty: 'Easy', count: 2 },
        { difficulty: 'Medium', count: 3 },
    ],
    averageCookTime: 45,
    mostPopularTags: [
        { tag: 'healthy', count: 3 },
        { tag: 'quick', count: 2 },
    ],
};

const mockUseUserProfile = {
    user: mockUser as typeof mockUser | null,
    stats: mockStats,
    isEditing: false,
    formData: {
        name: mockUser.name,
        email: mockUser.email,
    },
    isLoading: false,
    handleSubmit: vi.fn(),
    handleCancel: vi.fn(),
    handleFormDataChange: vi.fn(),
    handleEditClick: vi.fn(),
};

// Mock the useUserProfile hook
vi.mock('../../../../../src/hooks/user/useUserProfile', () => ({
    useUserProfile: () => mockUseUserProfile,
}));

// Mock the child components
vi.mock('../../../../../src/components/features/user-profile/UserProfileHeader', () => ({
    UserProfileHeader: ({ user, onEditClick }: { user: any; onEditClick: () => void }) => (
        <div data-testid="user-profile-header">
            <span>User: {user.name}</span>
            <button onClick={onEditClick}>Edit Profile</button>
        </div>
    ),
}));

vi.mock('../../../../../src/components/features/user-profile/UserProfileEditModal', () => ({
    UserProfileEditModal: ({
        isOpen,
        formData,
        isLoading,
        onSubmit,
        onCancel,
        onFormDataChange
    }: {
        isOpen: boolean;
        formData: any;
        isLoading: boolean;
        onSubmit: () => void;
        onCancel: () => void;
        onFormDataChange: () => void;
    }) => (
        <div data-testid="user-profile-edit-modal">
            {isOpen && (
                <div>
                    <span>Editing: {formData.name}</span>
                    <button onClick={onSubmit} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={onFormDataChange}>Change Data</button>
                </div>
            )}
        </div>
    ),
}));

vi.mock('../../../../../src/components/features/user-profile/UserProfileStats', () => ({
    UserProfileStats: ({ stats }: { stats: any }) => (
        <div data-testid="user-profile-stats">
            <span>Total Recipes: {stats.totalRecipes}</span>
        </div>
    ),
}));

vi.mock('../../../../../src/components/features/user-profile/UserProfileActivity', () => ({
    UserProfileActivity: ({ user, totalRecipes }: { user: any; totalRecipes: number }) => (
        <div data-testid="user-profile-activity">
            <span>Activity for {user.name} - {totalRecipes} recipes</span>
        </div>
    ),
}));

const TestAuthProvider = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={{
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: async () => { },
        register: async () => { },
        logout: () => { },
        updateProfile: async () => { },
        changePassword: async () => { },
        refreshUser: async () => { },
    }}>
        {children}
    </AuthContext.Provider>
);

const TestProviders = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>
        <TestAuthProvider>{children}</TestAuthProvider>
    </QueryClientProvider>
);

describe('UserProfile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the mock to default values
        mockUseUserProfile.user = mockUser;
        mockUseUserProfile.stats = mockStats;
        mockUseUserProfile.isEditing = false;
        mockUseUserProfile.isLoading = false;
    });

    it('renders login prompt if no user', () => {
        mockUseUserProfile.user = null;

        render(<UserProfile />, { wrapper: TestProviders });
        expect(screen.getByText(/please log in/i)).toBeInTheDocument();
    });

    it('renders user profile components when user exists', () => {
        render(<UserProfile />, { wrapper: TestProviders });

        expect(screen.getByTestId('user-profile-header')).toBeInTheDocument();
        expect(screen.getByTestId('user-profile-edit-modal')).toBeInTheDocument();
        expect(screen.getByTestId('user-profile-stats')).toBeInTheDocument();
        expect(screen.getByTestId('user-profile-activity')).toBeInTheDocument();
    });

    it('passes correct props to UserProfileHeader', () => {
        render(<UserProfile />, { wrapper: TestProviders });

        expect(screen.getByText('User: Test User')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();
    });

    it('passes correct props to UserProfileEditModal', () => {
        mockUseUserProfile.isEditing = true;
        mockUseUserProfile.isLoading = true;

        render(<UserProfile />, { wrapper: TestProviders });

        expect(screen.getByText('Editing: Test User')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('passes correct props to UserProfileStats', () => {
        render(<UserProfile />, { wrapper: TestProviders });

        expect(screen.getByText('Total Recipes: 5')).toBeInTheDocument();
    });

    it('passes correct props to UserProfileActivity', () => {
        render(<UserProfile />, { wrapper: TestProviders });

        expect(screen.getByText('Activity for Test User - 5 recipes')).toBeInTheDocument();
    });

    it('renders with proper container styling', () => {
        const { container } = render(<UserProfile />, { wrapper: TestProviders });

        const mainContainer = container.firstChild as HTMLElement;
        expect(mainContainer).toHaveClass('max-w-4xl', 'mx-auto', 'space-y-6');
    });

    it('does not render edit modal content when not editing', () => {
        mockUseUserProfile.isEditing = false;

        render(<UserProfile />, { wrapper: TestProviders });

        expect(screen.queryByText('Editing: Test User')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    });

    it('handles loading state correctly', () => {
        mockUseUserProfile.isLoading = true;
        mockUseUserProfile.isEditing = true;

        render(<UserProfile />, { wrapper: TestProviders });

        const saveButton = screen.getByRole('button', { name: 'Saving...' });
        expect(saveButton).toBeDisabled();
    });

    it('renders login message with correct styling', () => {
        mockUseUserProfile.user = null;

        render(<UserProfile />, { wrapper: TestProviders });

        const loginMessage = screen.getByText(/please log in/i);
        expect(loginMessage.closest('div')).toHaveClass('text-center', 'py-12');
        expect(loginMessage).toHaveClass('text-gray-600');
    });
}); 