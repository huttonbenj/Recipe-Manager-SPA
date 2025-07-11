import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent } from '../../../utils/test-utils';
import { NavigationUserMenu } from '../../../../components/features/navigation/NavigationUserMenu';

describe('NavigationUserMenu', () => {
    const user = { name: 'Test User', email: 'test@example.com' };
    const onToggleUserMenu = vi.fn();
    const onLogout = vi.fn();

    it('renders user avatar button', () => {
        renderWithProviders(
            <NavigationUserMenu
                user={user}
                isUserMenuOpen={false}
                onToggleUserMenu={onToggleUserMenu}
                onLogout={onLogout}
            />
        );
        expect(screen.getByLabelText(/open user menu/i)).toBeInTheDocument();
    });

    it('shows user menu when open', () => {
        renderWithProviders(
            <NavigationUserMenu
                user={user}
                isUserMenuOpen={true}
                onToggleUserMenu={onToggleUserMenu}
                onLogout={onLogout}
            />
        );
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
        expect(screen.getByText(/profile/i)).toBeInTheDocument();
        expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    });

    it('calls onLogout when sign out is clicked', () => {
        renderWithProviders(
            <NavigationUserMenu
                user={user}
                isUserMenuOpen={true}
                onToggleUserMenu={onToggleUserMenu}
                onLogout={onLogout}
            />
        );
        fireEvent.click(screen.getByText(/sign out/i));
        expect(onLogout).toHaveBeenCalled();
    });
}); 