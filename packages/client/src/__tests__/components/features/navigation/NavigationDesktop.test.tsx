import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { NavigationDesktop } from '../../../../components/features/navigation/NavigationDesktop';

describe('NavigationDesktop', () => {
    const isActive = (path: string) => path === '/dashboard';

    it('renders all navigation items', () => {
        renderWithProviders(<NavigationDesktop isActive={isActive} />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Recipes')).toBeInTheDocument();
        expect(screen.getByText('Add Recipe')).toBeInTheDocument();
    });

    it('applies active class to active item', () => {
        renderWithProviders(<NavigationDesktop isActive={isActive} />);
        const dashboardLink = screen.getByText('Dashboard');
        expect(dashboardLink.className).toMatch(/border-blue-500/);
    });
}); 