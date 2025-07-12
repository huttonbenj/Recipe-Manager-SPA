import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChefHat,
    Search,
    Bell,
    Menu,
    X,
    Command,
    BookOpen,
    Plus,
    User
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeColors } from '../../../utils/theme';
import { ModernBrowseTab } from './tabs/ModernBrowseTab';
import { ModernMyRecipesTab } from './tabs/ModernMyRecipesTab';
import { ModernCreateTab } from './tabs/ModernCreateTab';
import { ModernProfileTab } from './tabs/ModernProfileTab';
import { ThemeControls } from './ThemeControls';
import { GlobalSearch } from './GlobalSearch';
import { cn } from '../../../utils/cn';

type TabId = 'browse' | 'my-recipes' | 'create' | 'profile';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ComponentType<any>; // Changed LucideProps to any as LucideProps is no longer imported
    component: React.ComponentType;
    description?: string;
}



const tabs: Tab[] = [
    { id: 'browse', label: 'Browse', icon: Search, component: ModernBrowseTab, description: 'Discover recipes' },
    { id: 'my-recipes', label: 'My Recipes', icon: BookOpen, component: ModernMyRecipesTab, description: 'Your collection' },
    { id: 'create', label: 'Create', icon: Plus, component: ModernCreateTab, description: 'New recipe' },
    { id: 'profile', label: 'Profile', icon: User, component: ModernProfileTab, description: 'Your account' },
];

export const ModernApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('browse');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    // Handle tab changes and URL synchronization
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/my-recipes')) {
            setActiveTab('my-recipes');
        } else if (path.includes('/create')) {
            setActiveTab('create');
        } else if (path.includes('/profile')) {
            setActiveTab('profile');
        } else {
            setActiveTab('browse');
        }
    }, [location.pathname]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleTabChange = (tabId: TabId) => {
        setActiveTab(tabId);
        switch (tabId) {
            case 'browse':
                navigate('/');
                break;
            case 'my-recipes':
                navigate('/my-recipes');
                break;
            case 'create':
                navigate('/create');
                break;
            case 'profile':
                navigate('/profile');
                break;
        }
    };

    const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component || ModernBrowseTab;

    // Theme-aware colors using dynamic theme utilities
    const getLocalThemeColors = () => {
        return {
            primary: `bg-gradient-to-br ${themeColors.primary} ${themeColors.secondary}`,
            primaryHover: `${themeColors.primary.replace('600', '700')} ${themeColors.secondary.replace('600', '700')}`,
            accent: `bg-gradient-to-br ${themeColors.secondary} ${themeColors.secondary}`,
            text: `${themeColors.primary} dark:${themeColors.primary.replace('600', '400')}`,
            bg: `${themeColors.primary.replace('600', '50')} dark:${themeColors.primary.replace('600', '900/20')}`,
            border: `border-${themeColors.primary.split('-')[1]}-200 dark:border-${themeColors.primary.split('-')[1]}-800`,
            glow: `shadow-lg shadow-${themeColors.primary.split('-')[1]}-500/25`
        };
    };

    const colors = getLocalThemeColors();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-500">
            {/* Two-Layer Header */}
            <header className="sticky top-0 z-50">
                {/* Top Navigation Bar */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo & Brand */}
                            <div className="flex items-center space-x-3">
                                <div className={cn(
                                    "w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center",
                                    colors.primary,
                                    colors.glow
                                )}>
                                    <ChefHat className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Recipe Manager
                                    </h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Professional cooking companion
                                    </p>
                                </div>
                            </div>

                            {/* Right Side Controls */}
                            <div className="flex items-center space-x-4">
                                {/* Online Status */}
                                <div className="hidden lg:flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Online</span>
                                </div>

                                {/* Search Button */}
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 group"
                                >
                                    <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300 hidden xl:block">
                                        Quick Search
                                    </span>
                                    <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                        <Command className="w-3 h-3" />
                                        <span>K</span>
                                    </div>
                                </button>

                                {/* Light/Dark Mode */}
                                <div className="hidden md:block">
                                    <ThemeControls />
                                </div>

                                {/* Notifications */}
                                <button className="relative p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 group">
                                    <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white font-bold">2</span>
                                    </div>
                                </button>

                                {/* User Profile */}
                                <div className="flex items-center space-x-3">
                                    <div className="hidden xl:block text-right">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Premium Chef
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className={cn(
                                            "w-8 h-8 bg-gradient-to-br rounded-full flex items-center justify-center",
                                            colors.accent
                                        )}>
                                            <span className="text-white text-sm font-medium">
                                                {user?.name?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                    </div>
                                </div>

                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white dark:bg-gray-800 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="hidden md:flex -mb-px space-x-8">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={cn(
                                            "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200",
                                            isActive
                                                ? `border-${theme.color === 'default' ? 'emerald' : theme.color}-500 text-${theme.color === 'default' ? 'emerald' : theme.color}-600 dark:text-${theme.color === 'default' ? 'emerald' : theme.color}-400`
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                        <div className="px-4 py-3 space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={cn(
                                            "flex items-center space-x-3 w-full px-3 py-2 rounded-md font-medium text-sm transition-all duration-200",
                                            isActive
                                                ? `${colors.text} ${colors.bg}`
                                                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}

                            {/* Mobile Theme Controls */}
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                                    <ThemeControls />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Tab Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="transition-all duration-300 ease-in-out">
                    <ActiveTabComponent />
                </div>
            </main>

            {/* Enhanced Global Search */}
            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}; 