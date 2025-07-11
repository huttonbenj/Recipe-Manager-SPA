import React from 'react';
import { useNavigation } from '../../../hooks/useNavigation';
import { NavigationLogo } from './NavigationLogo';
import { NavigationDesktop } from './NavigationDesktop';
import { NavigationUserMenu } from './NavigationUserMenu';
import { NavigationMobileButton } from './NavigationMobileButton';
import { NavigationMobile } from './NavigationMobile';

export const Navigation: React.FC = () => {
    const {
        user,
        isMenuOpen,
        isUserMenuOpen,
        isActive,
        handleLogout,
        toggleMenu,
        closeMenu,
        toggleUserMenu,
    } = useNavigation();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200" data-testid="nav">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <NavigationLogo />
                        <NavigationDesktop isActive={isActive} />
                    </div>

                    <NavigationUserMenu
                        user={user}
                        isUserMenuOpen={isUserMenuOpen}
                        onToggleUserMenu={toggleUserMenu}
                        onLogout={handleLogout}
                    />

                    <NavigationMobileButton
                        isMenuOpen={isMenuOpen}
                        onToggleMenu={toggleMenu}
                    />
                </div>
            </div>

            <NavigationMobile
                isMenuOpen={isMenuOpen}
                user={user}
                isActive={isActive}
                onMenuClose={closeMenu}
                onLogout={handleLogout}
            />
        </nav>
    );
}; 