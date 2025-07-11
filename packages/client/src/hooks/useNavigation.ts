import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useNavigation = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isActive = (path: string) => location.pathname === path;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const closeUserMenu = () => setIsUserMenuOpen(false);

    return {
        user,
        isMenuOpen,
        isUserMenuOpen,
        isActive,
        handleLogout,
        toggleMenu,
        closeMenu,
        toggleUserMenu,
        closeUserMenu,
    };
}; 