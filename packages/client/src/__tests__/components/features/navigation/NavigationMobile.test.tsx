import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent } from '../../../utils/test-utils';
import { NavigationMobile } from '../../../../components/features/navigation/NavigationMobile';

describe('NavigationMobile', () => {
    const user = { name: 'Test User', email: 'test@example.com' };
    const isActive = (path: string) => path === '/dashboard';
    const onMenuClose = vi.fn();
    const onLogout = vi.fn();

    it('does not render when closed', () => {
        renderWithProviders(
            <NavigationMobile
                isMenuOpen={false}
                user={user}
                isActive={isActive}
                onMenuClose={onMenuClose}
                onLogout={onLogout}
            />
        );
        expect(screen.queryByText('Dashboard')).toBeNull();
    });

    it('renders nav items and user info when open', () => {
        renderWithProviders(
            <NavigationMobile
                isMenuOpen={true}
                user={user}
                isActive={isActive}
                onMenuClose={onMenuClose}
                onLogout={onLogout}
            />
        );
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Recipes')).toBeInTheDocument();
        expect(screen.getByText('Add Recipe')).toBeInTheDocument();
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
    });

    it('calls onLogout when sign out is clicked', () => {
        renderWithProviders(
            <NavigationMobile
                isMenuOpen={true}
                user={user}
                isActive={isActive}
                onMenuClose={onMenuClose}
                onLogout={onLogout}
            />
        );
        fireEvent.click(screen.getByText(/sign out/i));
        expect(onLogout).toHaveBeenCalled();
    });
}); 