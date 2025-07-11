import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigation } from '../../../hooks/ui/useNavigation';
import { NavigationLogo } from './NavigationLogo';
import { NavigationDesktop } from './NavigationDesktop';
import { NavigationUserMenu } from './NavigationUserMenu';
import { NavigationMobileButton } from './NavigationMobileButton';
import { NavigationMobile } from './NavigationMobile';
import { ThemeToggle } from '../../ui/ThemeToggle';
import { Search, X, TrendingUp, Clock, Star, ChefHat } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface SearchSuggestion {
    id: string;
    title: string;
    type: 'recipe' | 'ingredient' | 'category';
    icon: React.ComponentType<any>;
    description?: string;
}

const mockSuggestions: SearchSuggestion[] = [
    { id: '1', title: 'Chocolate Cake', type: 'recipe', icon: ChefHat, description: 'Decadent chocolate dessert' },
    { id: '2', title: 'Chicken Parmesan', type: 'recipe', icon: ChefHat, description: 'Italian-style chicken breast' },
    { id: '3', title: 'Avocado', type: 'ingredient', icon: Star, description: 'Fresh produce' },
    { id: '4', title: 'Breakfast', type: 'category', icon: Clock, description: 'Morning recipes' },
];

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

    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Handle scroll effect for navigation
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            setIsScrolled(scrollTop > 10);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle search suggestions
    useEffect(() => {
        if (searchQuery.length > 0) {
            const filtered = mockSuggestions.filter(suggestion =>
                suggestion.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchSuggestions(filtered);
        } else {
            setSearchSuggestions([]);
        }
    }, [searchQuery]);

    // Handle escape key to close search
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isSearchOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Handle search submission
            console.log('Search for:', searchQuery);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        setSearchQuery(suggestion.title);
        setIsSearchOpen(false);
        // Navigate to suggestion
        console.log('Navigate to:', suggestion);
    };

    const openSearch = () => {
        setIsSearchOpen(true);
        setSearchQuery('');
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setIsSearchFocused(false);
    };

    return (
        <>
            <nav
                className={cn(
                    "sticky top-0 z-40 w-full transition-all duration-300",
                    isScrolled
                        ? "glass-navbar shadow-lg backdrop-blur-xl"
                        : "bg-white/95 dark:bg-surface-900/95 backdrop-blur-sm",
                    "border-b border-surface-200/60 dark:border-surface-800/60"
                )}
                data-testid="nav"
            >
                {/* Scroll progress bar */}
                <div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <NavigationLogo />
                            <NavigationDesktop isActive={isActive} />
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Search button */}
                            <button
                                onClick={openSearch}
                                className={cn(
                                    "relative p-2 text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50",
                                    "rounded-full transition-all duration-200 hover:bg-surface-100 dark:hover:bg-surface-800",
                                    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                                    "hover:scale-105 active:scale-95"
                                )}
                                aria-label="Search"
                            >
                                <Search className="h-5 w-5" />
                                <span className="sr-only">Search recipes</span>
                            </button>

                            <ThemeToggle variant="compact" />

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
                </div>
            </nav>

            {/* Mobile navigation */}
            <NavigationMobile
                isMenuOpen={isMenuOpen}
                user={user}
                isActive={isActive}
                onMenuClose={closeMenu}
                onLogout={handleLogout}
            />

            {/* Enhanced search overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={closeSearch}
                    />

                    {/* Search panel */}
                    <div className="fixed inset-x-0 top-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 animate-in slide-in-from-top duration-300">
                        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <Search className="h-6 w-6 text-brand-500" />
                                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 font-display">
                                        Search Recipes
                                    </h2>
                                </div>
                                <button
                                    onClick={closeSearch}
                                    className="p-2 text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                    aria-label="Close search"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSearchSubmit} className="relative">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 dark:text-surface-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                        placeholder="Search for recipes, ingredients, or categories..."
                                        className={cn(
                                            "w-full h-14 pl-12 pr-4 text-lg bg-white dark:bg-surface-900 border-2 border-surface-200 dark:border-surface-700",
                                            "rounded-2xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all duration-200",
                                            "placeholder:text-surface-400 dark:placeholder:text-surface-500",
                                            isSearchFocused && "shadow-lg"
                                        )}
                                        autoFocus
                                    />
                                </div>

                                {/* Search suggestions */}
                                {(searchSuggestions.length > 0 || isSearchFocused) && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-900 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                        {searchSuggestions.length > 0 ? (
                                            <div className="py-2">
                                                {searchSuggestions.map((suggestion) => {
                                                    const Icon = suggestion.icon;
                                                    return (
                                                        <button
                                                            key={suggestion.id}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            className="w-full px-4 py-3 text-left hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors flex items-center space-x-3"
                                                        >
                                                            <Icon className="h-5 w-5 text-surface-400 dark:text-surface-500" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-surface-900 dark:text-surface-50">
                                                                    {suggestion.title}
                                                                </p>
                                                                {suggestion.description && (
                                                                    <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                                                                        {suggestion.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <span className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 rounded-full">
                                                                {suggestion.type}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-surface-500 dark:text-surface-400">
                                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p>Start typing to search...</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </form>

                            {/* Popular searches */}
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="h-4 w-4 text-brand-500" />
                                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                                        Popular searches
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: 'Breakfast', category: 'breakfast' },
                                        { label: 'Vegetarian', category: 'vegetarian' },
                                        { label: 'Desserts', category: 'desserts' },
                                        { label: 'Quick & Easy', category: 'quick' },
                                        { label: 'Healthy', category: 'healthy' },
                                        { label: 'Pasta', category: 'pasta' },
                                    ].map((item) => (
                                        <Link
                                            key={item.category}
                                            to={`/recipes?category=${item.category}`}
                                            onClick={closeSearch}
                                            className="px-3 py-1.5 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-full text-sm hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors hover:scale-105"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Recent searches */}
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-surface-500" />
                                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                                        Recent searches
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        'Chicken tikka masala',
                                        'Chocolate chip cookies',
                                        'Caesar salad',
                                    ].map((search) => (
                                        <button
                                            key={search}
                                            onClick={() => {
                                                setSearchQuery(search);
                                                handleSearchSubmit(new Event('submit') as any);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-lg transition-colors"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}; 