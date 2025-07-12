import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '../../../hooks/ui/useNavigation';
import { useDebounce, useLocalStorage } from '../../../hooks';
import { recipeService } from '../../../services';
import { NavigationLogo } from './NavigationLogo';
import { NavigationDesktop } from './NavigationDesktop';
import { NavigationUserMenu } from './NavigationUserMenu';
import { NavigationMobileButton } from './NavigationMobileButton';
import { NavigationMobile } from './NavigationMobile';
import { ThemeToggle } from '../../ui/ThemeToggle';
import {
    Search, X, TrendingUp, Clock, ChefHat, Tag, Filter,
    History, Star, Utensils, Flame, ArrowRight,
    Sparkles, Zap, Heart, BookOpen
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { parseSearchQuery, formatSearchDescription } from '../../../utils/searchParser';

interface SearchSuggestion {
    id: string;
    title: string;
    type: 'recipe' | 'ingredient' | 'category' | 'user';
    icon: React.ComponentType<any>;
    description?: string;
    metadata?: {
        difficulty?: string;
        cookTime?: number;
        category?: string;
        rating?: number;
        likes?: number;
    };
}

interface RecentSearch {
    id: string;
    query: string;
    timestamp: number;
    filters?: {
        category?: string;
        difficulty?: string;
        cookTime?: string;
    };
}

interface PopularRecipe {
    id: string;
    title: string;
    category?: string;
    difficulty?: string;
    cookTime?: number;
    likes: number;
    image?: string;
}

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

    const navigate = useNavigate();

    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    // Local storage for recent searches
    const [recentSearches, setRecentSearches] = useLocalStorage<RecentSearch[]>('recentSearches', []);

    // Debounced search query for API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Parse current search query for filter preview
    const parsedQuery = parseSearchQuery(searchQuery);

    // Fetch search suggestions from backend
    const { data: searchResults } = useQuery({
        queryKey: ['search-suggestions', debouncedSearchQuery],
        queryFn: () => recipeService.searchRecipes({
            search: debouncedSearchQuery,
            page: 1,
            limit: 8
        }),
        enabled: Boolean(debouncedSearchQuery && debouncedSearchQuery.length > 1),
        staleTime: 30000, // 30 seconds
    });

    // Fetch categories for popular searches
    const { data: categories } = useQuery({
        queryKey: ['recipe-categories'],
        queryFn: () => recipeService.getRecipeCategories(),
        staleTime: 300000, // 5 minutes
    });

    // Fetch popular recipes
    const { data: popularRecipesData } = useQuery({
        queryKey: ['popular-recipes'],
        queryFn: () => recipeService.getRecipes({
            page: 1,
            limit: 6,
            sortBy: 'created_at',
            sortOrder: 'desc'
        }),
        staleTime: 180000, // 3 minutes
    });

    // Fetch trending searches (mock data for now, could be from analytics)
    const trendingSearches = [
        { query: 'pasta carbonara', count: 156 },
        { query: 'chocolate cake', count: 142 },
        { query: 'quick breakfast', count: 98 },
        { query: 'healthy salad', count: 87 },
        { query: 'chicken curry', count: 76 },
    ];

    // Convert API results to suggestions format
    const recipeSuggestions: SearchSuggestion[] = searchResults?.data?.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        type: 'recipe' as const,
        icon: ChefHat,
        description: `${recipe.category || 'Unknown'} • ${recipe.difficulty || 'Unknown'} • ${recipe.cook_time || 0}min`,
        ...(recipe.difficulty || recipe.cook_time || recipe.category ? {
            metadata: {
                ...(recipe.difficulty && { difficulty: recipe.difficulty }),
                ...(recipe.cook_time && { cookTime: recipe.cook_time }),
                ...(recipe.category && { category: recipe.category }),
                likes: 0, // Would come from API
            },
        } : {}),
    })) || [];

    // Add category suggestions if search query matches
    const categorySuggestions: SearchSuggestion[] = categories?.filter(category =>
        category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    ).slice(0, 3).map(category => ({
        id: `category-${category}`,
        title: category,
        type: 'category' as const,
        icon: Tag,
        description: `Browse ${category} recipes`,
    })) || [];

    // Add ingredient suggestions (mock data - could be from ingredients API)
    const ingredientSuggestions: SearchSuggestion[] = debouncedSearchQuery.length > 2 ? [
        { id: 'ing-chicken', title: 'Chicken', type: 'ingredient' as const, icon: Utensils, description: 'Recipes with chicken' },
        { id: 'ing-pasta', title: 'Pasta', type: 'ingredient' as const, icon: Utensils, description: 'Pasta dishes' },
        { id: 'ing-chocolate', title: 'Chocolate', type: 'ingredient' as const, icon: Utensils, description: 'Chocolate desserts' },
    ].filter(ing => ing.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())).slice(0, 2) : [];

    // Combine all suggestions
    const allSuggestions = [...recipeSuggestions, ...categorySuggestions, ...ingredientSuggestions];

    // Popular recipes for display
    const popularRecipes: PopularRecipe[] = popularRecipesData?.data?.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        category: recipe.category,
        difficulty: recipe.difficulty,
        cookTime: recipe.cook_time,
        likes: 0, // Would come from API
        image: recipe.image_url,
    } as PopularRecipe)) || [];

    // Popular searches from categories
    const popularSearches = categories?.slice(0, 6).map(category => ({
        label: category,
        category: category,
        icon: Tag,
    })) || [
            { label: 'Main Course', category: 'Main Course', icon: Tag },
            { label: 'Dessert', category: 'Dessert', icon: Tag },
            { label: 'Salad', category: 'Salad', icon: Tag },
        ];

    // Quick filter suggestions
    const quickFilters = [
        { label: 'Easy', type: 'difficulty', value: 'Easy', icon: Zap, color: 'green' },
        { label: 'Quick (≤30min)', type: 'cookTime', value: '30', icon: Clock, color: 'blue' },
        { label: 'Popular', type: 'sort', value: 'popular', icon: TrendingUp, color: 'purple' },
        { label: 'Recent', type: 'sort', value: 'recent', icon: Sparkles, color: 'orange' },
    ];

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

    // Handle escape key to close search
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
                setSelectedSuggestionIndex(-1);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isSearchOpen]);

    // Save search to recent searches
    const saveRecentSearch = (query: string, filters?: any) => {
        const newSearch: RecentSearch = {
            id: Date.now().toString(),
            query,
            timestamp: Date.now(),
            filters,
        };

        const updatedSearches = [
            newSearch,
            ...recentSearches.filter(search => search.query !== query)
        ].slice(0, 10); // Keep only last 10 searches

        setRecentSearches(updatedSearches);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Parse the search query to extract filters
            const parsed = parseSearchQuery(searchQuery.trim());

            // Save to recent searches
            saveRecentSearch(searchQuery.trim(), parsed);

            // Build URL with extracted filters
            const params = new URLSearchParams();
            if (parsed.searchTerm) params.set('search', parsed.searchTerm);
            if (parsed.category) params.set('category', parsed.category);
            if (parsed.difficulty) params.set('difficulty', parsed.difficulty);
            if (parsed.cookTime) params.set('cookTime', parsed.cookTime);

            // Always navigate to recipes page, even if only filters are present
            const queryString = params.toString();
            navigate(`/recipes${queryString ? `?${queryString}` : ''}`);
            setIsSearchOpen(false);
            setSearchQuery('');
            setSelectedSuggestionIndex(-1);
        }
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        if (suggestion.type === 'recipe') {
            // Navigate to recipe detail page
            navigate(`/recipes/${suggestion.id}`);
        } else if (suggestion.type === 'category') {
            // Navigate to recipes page with category filter
            navigate(`/recipes?category=${encodeURIComponent(suggestion.title)}`);
        } else if (suggestion.type === 'ingredient') {
            // Navigate to recipes page with ingredient search
            navigate(`/recipes?search=${encodeURIComponent(suggestion.title)}`);
        } else {
            // Navigate to recipes page with search query
            navigate(`/recipes?search=${encodeURIComponent(suggestion.title)}`);
        }

        // Save to recent searches
        saveRecentSearch(suggestion.title);

        setIsSearchOpen(false);
        setSearchQuery('');
        setSelectedSuggestionIndex(-1);
    };

    const handleQuickFilterClick = (filter: any) => {
        const params = new URLSearchParams();
        if (filter.type === 'difficulty') {
            params.set('difficulty', filter.value);
        } else if (filter.type === 'cookTime') {
            params.set('cookTime', filter.value);
        } else if (filter.type === 'sort') {
            if (filter.value === 'popular') {
                params.set('sortBy', 'created_at');
                params.set('sortOrder', 'desc');
            } else if (filter.value === 'recent') {
                params.set('sortBy', 'created_at');
                params.set('sortOrder', 'desc');
            }
        }

        navigate(`/recipes?${params.toString()}`);
        setIsSearchOpen(false);
    };

    const handleRecentSearchClick = (recentSearch: RecentSearch) => {
        const params = new URLSearchParams();
        params.set('search', recentSearch.query);

        if (recentSearch.filters) {
            Object.entries(recentSearch.filters).forEach(([key, value]) => {
                if (value) params.set(key, value);
            });
        }

        navigate(`/recipes?${params.toString()}`);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isSearchOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev =>
                prev < allSuggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedSuggestionIndex >= 0 && allSuggestions[selectedSuggestionIndex]) {
                handleSuggestionClick(allSuggestions[selectedSuggestionIndex]);
            } else {
                handleSearchSubmit(e);
            }
        }
    };

    const openSearch = () => {
        setIsSearchOpen(true);
        setSearchQuery('');
        setSelectedSuggestionIndex(-1);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setIsSearchFocused(false);
        setSelectedSuggestionIndex(-1);
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={closeSearch}
                    />

                    {/* Search panel */}
                    <div className="fixed inset-x-0 top-0 bg-white/98 dark:bg-surface-900/98 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 animate-in slide-in-from-top duration-300 max-h-screen overflow-y-auto">
                        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-4xl">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-xl">
                                        <Search className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 font-display">
                                            Search Recipes
                                        </h2>
                                        <p className="text-sm text-surface-500 dark:text-surface-400">
                                            Find recipes, ingredients, and more
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeSearch}
                                    className="p-2 text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                    aria-label="Close search"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Search Input */}
                            <form onSubmit={handleSearchSubmit} className="relative mb-6" autoComplete="off">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 dark:text-surface-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 300)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={
                                            parsedQuery.category || parsedQuery.difficulty || parsedQuery.cookTime
                                                ? `Searching: ${formatSearchDescription(parsedQuery)}`
                                                : "Search for recipes, ingredients, or categories..."
                                        }
                                        className={cn(
                                            "w-full h-14 pl-12 pr-32 text-lg bg-white dark:bg-surface-900 border-2 border-surface-200 dark:border-surface-700",
                                            "rounded-2xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all duration-200",
                                            "placeholder:text-surface-400 dark:placeholder:text-surface-500",
                                            isSearchFocused && "shadow-lg"
                                        )}
                                        autoFocus
                                    />
                                    {/* Search hint */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-surface-400 dark:text-surface-500 flex items-center space-x-1">
                                        <span>⌘K</span>
                                        <span>•</span>
                                        <span>Enter to search</span>
                                    </div>
                                </div>

                                {/* Filter preview - show when filters are detected */}
                                {(parsedQuery.category || parsedQuery.difficulty || parsedQuery.cookTime) && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {parsedQuery.category && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {parsedQuery.category}
                                            </span>
                                        )}
                                        {parsedQuery.difficulty && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                <Filter className="h-3 w-3 mr-1" />
                                                {parsedQuery.difficulty}
                                            </span>
                                        )}
                                        {parsedQuery.cookTime && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                <Clock className="h-3 w-3 mr-1" />
                                                ≤ {parsedQuery.cookTime}min
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Search suggestions - only show when actively typing */}
                                {allSuggestions.length > 0 && searchQuery.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-900 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden animate-in slide-in-from-top-2 duration-200 max-h-80 overflow-y-auto z-10">
                                        <div className="py-2">
                                            <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-800">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Sparkles className="h-4 w-4 text-brand-500" />
                                                        <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                                                            Quick suggestions
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-surface-500 dark:text-surface-400">
                                                        ↑↓ navigate • Enter select
                                                    </span>
                                                </div>
                                            </div>
                                            {allSuggestions.map((suggestion, index) => {
                                                const Icon = suggestion.icon;
                                                const isSelected = selectedSuggestionIndex === index;
                                                return (
                                                    <button
                                                        key={suggestion.id}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className={cn(
                                                            "w-full px-4 py-3 text-left hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors flex items-center space-x-3",
                                                            isSelected && "bg-brand-50 dark:bg-brand-900/20"
                                                        )}
                                                    >
                                                        <Icon className={cn(
                                                            "h-5 w-5 text-surface-400 dark:text-surface-500",
                                                            isSelected && "text-brand-500"
                                                        )} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className={cn(
                                                                "font-medium text-surface-900 dark:text-surface-50",
                                                                isSelected && "text-brand-900 dark:text-brand-100"
                                                            )}>
                                                                {suggestion.title}
                                                            </p>
                                                            {suggestion.description && (
                                                                <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                                                                    {suggestion.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {suggestion.metadata?.likes && (
                                                                <span className="text-xs text-surface-500 dark:text-surface-400 flex items-center">
                                                                    <Heart className="h-3 w-3 mr-1" />
                                                                    {suggestion.metadata.likes}
                                                                </span>
                                                            )}
                                                            <span className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 rounded-full">
                                                                {suggestion.type}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </form>

                            {/* Content - only show when not actively searching */}
                            {searchQuery.length === 0 && (
                                <div className="space-y-8">
                                    {/* Quick Filters */}
                                    <div className="bg-surface-50 dark:bg-surface-800/50 rounded-2xl p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Zap className="h-5 w-5 text-brand-500" />
                                            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                                                Quick Filters
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {quickFilters.map((filter) => {
                                                const Icon = filter.icon;
                                                const colorClasses = {
                                                    green: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 hover:dark:bg-green-900/70',
                                                    blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 hover:dark:bg-blue-900/70',
                                                    purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-200 hover:dark:bg-purple-900/70',
                                                    orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-200 hover:dark:bg-orange-900/70',
                                                };
                                                return (
                                                    <button
                                                        key={filter.label}
                                                        onClick={() => handleQuickFilterClick(filter)}
                                                        className={cn(
                                                            "p-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex flex-col items-center space-y-2 text-center",
                                                            colorClasses[filter.color as keyof typeof colorClasses]
                                                        )}
                                                    >
                                                        <Icon className="h-6 w-6" />
                                                        <span className="text-sm">{filter.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Main Content Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Categories & Trending */}
                                        <div className="lg:col-span-1 space-y-6">
                                            {/* Popular Categories */}
                                            <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                                                <div className="flex items-center space-x-2 mb-4">
                                                    <TrendingUp className="h-5 w-5 text-brand-500" />
                                                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                                                        Categories
                                                    </h3>
                                                </div>
                                                <div className="space-y-2">
                                                    {popularSearches.map((item) => {
                                                        const Icon = item.icon;
                                                        return (
                                                            <Link
                                                                key={item.category}
                                                                to={`/recipes?category=${encodeURIComponent(item.category)}`}
                                                                onClick={closeSearch}
                                                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-200 group"
                                                            >
                                                                <div className="p-2 bg-surface-100 dark:bg-surface-800 rounded-lg group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
                                                                    <Icon className="h-4 w-4 text-surface-600 dark:text-surface-400 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
                                                                </div>
                                                                <span className="font-medium text-surface-700 dark:text-surface-300 group-hover:text-surface-900 dark:group-hover:text-surface-50">
                                                                    {item.label}
                                                                </span>
                                                                <ArrowRight className="h-4 w-4 text-surface-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Trending Searches */}
                                            <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                                                <div className="flex items-center space-x-2 mb-4">
                                                    <Flame className="h-5 w-5 text-orange-500" />
                                                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                                                        Trending
                                                    </h3>
                                                </div>
                                                <div className="space-y-2">
                                                    {trendingSearches.slice(0, 5).map((trend, index) => (
                                                        <button
                                                            key={trend.query}
                                                            onClick={() => {
                                                                navigate(`/recipes?search=${encodeURIComponent(trend.query)}`);
                                                                closeSearch();
                                                            }}
                                                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-200 group"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
                                                                    {index + 1}
                                                                </div>
                                                                <span className="font-medium text-surface-700 dark:text-surface-300 group-hover:text-surface-900 dark:group-hover:text-surface-50">
                                                                    {trend.query}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-xs text-surface-500 dark:text-surface-400 flex items-center">
                                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                                    {trend.count}
                                                                </span>
                                                                <ArrowRight className="h-4 w-4 text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Popular Recipes */}
                                        <div className="lg:col-span-1">
                                            {popularRecipes.length > 0 && (
                                                <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                                                    <div className="flex items-center space-x-2 mb-4">
                                                        <Star className="h-5 w-5 text-yellow-500" />
                                                        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                                                            Popular Recipes
                                                        </h3>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {popularRecipes.slice(0, 4).map((recipe) => (
                                                            <Link
                                                                key={recipe.id}
                                                                to={`/recipes/${recipe.id}`}
                                                                onClick={closeSearch}
                                                                className="block p-4 bg-surface-50 dark:bg-surface-800 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-all duration-200 group"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center">
                                                                        <ChefHat className="h-6 w-6 text-white" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-semibold text-surface-900 dark:text-surface-50 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                                                                            {recipe.title}
                                                                        </p>
                                                                        <div className="flex items-center space-x-2 mt-1">
                                                                            <span className="text-xs px-2 py-1 bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 rounded-full">
                                                                                {recipe.category}
                                                                            </span>
                                                                            <span className="text-xs text-surface-500 dark:text-surface-400">
                                                                                {recipe.difficulty} • {recipe.cookTime}min
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-xs text-surface-500 dark:text-surface-400 flex items-center">
                                                                            <Heart className="h-3 w-3 mr-1" />
                                                                            {recipe.likes}
                                                                        </span>
                                                                        <ArrowRight className="h-4 w-4 text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Recent Searches & Examples */}
                                        <div className="lg:col-span-1 space-y-6">
                                            {/* Recent Searches */}
                                            {recentSearches.length > 0 && (
                                                <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center space-x-2">
                                                            <History className="h-5 w-5 text-surface-500" />
                                                            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                                                                Recent
                                                            </h3>
                                                        </div>
                                                        <button
                                                            onClick={clearRecentSearches}
                                                            className="text-xs text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 px-2 py-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                                        >
                                                            Clear all
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {recentSearches.slice(0, 5).map((search) => (
                                                            <button
                                                                key={search.id}
                                                                onClick={() => handleRecentSearchClick(search)}
                                                                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-200 group"
                                                            >
                                                                <History className="h-4 w-4 text-surface-400" />
                                                                <span className="flex-1 text-left font-medium text-surface-700 dark:text-surface-300 group-hover:text-surface-900 dark:group-hover:text-surface-50">
                                                                    {search.query}
                                                                </span>
                                                                <span className="text-xs text-surface-400">
                                                                    {new Date(search.timestamp).toLocaleDateString()}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Smart Search Examples */}
                                            <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                                                <div className="flex items-center space-x-2 mb-4">
                                                    <BookOpen className="h-5 w-5 text-surface-500" />
                                                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                                                        Try Smart Search
                                                    </h3>
                                                </div>
                                                <div className="text-sm text-surface-500 dark:text-surface-400 mb-4">
                                                    Use natural language to find exactly what you want
                                                </div>
                                                <div className="space-y-3">
                                                    {[
                                                        { query: 'easy chicken recipes', desc: 'Difficulty + ingredient', icon: '🍗' },
                                                        { query: 'quick dessert ideas', desc: 'Time + category', icon: '🍰' },
                                                        { query: 'healthy 30 minute meals', desc: 'Style + time constraint', icon: '🥗' },
                                                        { query: 'vegetarian pasta dishes', desc: 'Diet + ingredient', icon: '🍝' },
                                                    ].map((example) => (
                                                        <button
                                                            key={example.query}
                                                            onClick={() => {
                                                                navigate(`/recipes?search=${encodeURIComponent(example.query)}`);
                                                                closeSearch();
                                                            }}
                                                            className="w-full p-4 bg-surface-50 dark:bg-surface-800 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-all duration-200 group"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <span className="text-2xl">{example.icon}</span>
                                                                <div className="flex-1 text-left">
                                                                    <p className="font-medium text-surface-900 dark:text-surface-50 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                                                                        "{example.query}"
                                                                    </p>
                                                                    <p className="text-xs text-surface-500 dark:text-surface-400">
                                                                        {example.desc}
                                                                    </p>
                                                                </div>
                                                                <ArrowRight className="h-4 w-4 text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}; 