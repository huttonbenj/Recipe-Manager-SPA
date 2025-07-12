import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDebounce, useLocalStorage } from '../../../hooks';
import { recipeService } from '../../../services';
import { parseSearchQuery } from '../../../utils/searchParser';
import { cn } from '../../../utils/cn';
import { useTheme } from '../../../contexts/ThemeContext';
import {
    getThemeBadgeClasses,
    getThemeGradient,
    getThemeBackgroundColor,
    getThemeTextColor,
    getThemeColors
} from '../../../utils/theme';
import {
    Search, X, TrendingUp, Clock, ChefHat, Tag, Filter,
    History, Utensils, Sparkles, Zap, Heart, Lightbulb,
    ArrowRight, Leaf, Brain, Bookmark, ChefHat as Chef2
} from 'lucide-react';

interface SearchSuggestion {
    id: string;
    title: string;
    type: 'recipe' | 'ingredient' | 'category' | 'user' | 'advanced' | 'smart';
    icon: React.ComponentType<any>;
    description?: string;
    confidence?: number;
    metadata?: {
        difficulty?: string | undefined;
        cookTime?: number | undefined;
        category?: string | undefined;
        rating?: number | undefined;
        likes?: number | undefined;
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
    category?: string | undefined;
    difficulty?: string | undefined;
    cookTime?: number | undefined;
    likes: number;
    image?: string | undefined;
}

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

// Smart suggestion generator based on search context
const generateSmartSuggestions = (query: string): Array<{ query: string; reason: string; confidence: number }> => {
    const lowerQuery = query.toLowerCase();
    const suggestions: Array<{ query: string; reason: string; confidence: number }> = [];

    // Context-aware suggestions
    if (lowerQuery.includes('quick') || lowerQuery.includes('fast') || lowerQuery.includes('easy')) {
        suggestions.push({
            query: 'Easy 30-minute meals',
            reason: 'Perfect for busy weeknights',
            confidence: 0.9
        });
    }

    if (lowerQuery.includes('healthy') || lowerQuery.includes('diet') || lowerQuery.includes('low')) {
        suggestions.push({
            query: 'Healthy low-carb recipes',
            reason: 'Great for dietary goals',
            confidence: 0.85
        });
    }

    if (lowerQuery.includes('dinner') || lowerQuery.includes('meal')) {
        suggestions.push({
            query: 'Family dinner favorites',
            reason: 'Crowd-pleasing options',
            confidence: 0.8
        });
    }

    if (lowerQuery.includes('dessert') || lowerQuery.includes('sweet')) {
        suggestions.push({
            query: 'Quick chocolate desserts',
            reason: 'Satisfy your sweet tooth',
            confidence: 0.85
        });
    }

    return suggestions.slice(0, 2); // Limit to 2 smart suggestions
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useLocalStorage<RecentSearch[]>('recentSearches', []);
    const [showAdvancedMode, setShowAdvancedMode] = useState(false);
    const { theme } = useTheme();

    // Debounced search query for API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 200); // Faster debounce for better UX

    // Parse current search query for filter preview
    const parsedQuery = parseSearchQuery(searchQuery);

    // Fetch search suggestions from backend
    const { data: searchResults } = useQuery({
        queryKey: ['search-suggestions', debouncedSearchQuery],
        queryFn: () => recipeService.searchRecipes({
            search: debouncedSearchQuery,
            page: 1,
            limit: 12 // Increased limit for better suggestions
        }),
        enabled: Boolean(debouncedSearchQuery && debouncedSearchQuery.length > 1),
        staleTime: 15000, // Reduced stale time for fresher results
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
            limit: 8, // Increased for better variety
            sortBy: 'likes',
            sortOrder: 'desc'
        }),
        staleTime: 180000, // 3 minutes
    });

    // Convert API results to suggestions format with enhanced metadata
    const recipeSuggestions: SearchSuggestion[] = searchResults?.data?.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        type: 'recipe' as const,
        icon: ChefHat,
        description: `${recipe.category || 'Unknown'} • ${recipe.difficulty || 'Unknown'} • ${recipe.cook_time || 0}min`,
        confidence: 0.9,
        metadata: {
            difficulty: recipe.difficulty,
            cookTime: recipe.cook_time,
            category: recipe.category,
            likes: Math.floor(Math.random() * 50) + 5, // Mock likes data
            rating: Math.floor(Math.random() * 2) + 4, // Mock rating 4-5
        },
    })) || [];

    // Enhanced category suggestions with better matching
    const categorySuggestions: SearchSuggestion[] = categories?.filter(category =>
        category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    ).slice(0, 3).map(category => ({
        id: `category-${category}`,
        title: category,
        type: 'category' as const,
        icon: Tag,
        description: `Browse all ${category.toLowerCase()} recipes`,
        confidence: 0.8,
    })) || [];

    // Enhanced ingredient suggestions with better matching
    const ingredientSuggestions: SearchSuggestion[] = debouncedSearchQuery.length > 2 ? [
        { name: 'Chicken', icon: Chef2, desc: 'Protein-rich poultry dishes' },
        { name: 'Pasta', icon: Utensils, desc: 'Italian pasta dishes' },
        { name: 'Chocolate', icon: Lightbulb, desc: 'Decadent chocolate treats' },
        { name: 'Salmon', icon: Chef2, desc: 'Healthy fish recipes' },
        { name: 'Avocado', icon: Leaf, desc: 'Creamy, healthy recipes' },
        { name: 'Garlic', icon: Utensils, desc: 'Flavorful aromatic dishes' },
    ].filter(ing => ing.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
        .slice(0, 3)
        .map(ing => ({
            id: `ing-${ing.name.toLowerCase()}`,
            title: ing.name,
            type: 'ingredient' as const,
            icon: ing.icon,
            description: ing.desc,
            confidence: 0.7,
        })) : [];

    // Smart AI-like suggestions
    const smartSuggestions: SearchSuggestion[] = searchQuery.length > 2 ?
        generateSmartSuggestions(searchQuery).map((smart, index) => ({
            id: `smart-${index}`,
            title: smart.query,
            type: 'smart' as const,
            icon: Brain,
            description: smart.reason,
            confidence: smart.confidence,
        })) : [];

    // Advanced search suggestion
    const advancedSearchSuggestion: SearchSuggestion[] = searchQuery.length > 0 ? [{
        id: 'advanced-search',
        title: `Advanced search for "${searchQuery}"`,
        type: 'advanced' as const,
        icon: Filter,
        description: 'Use advanced filters and options',
        confidence: 0.5,
    }] : [];

    // Combine all suggestions with confidence sorting
    const allSuggestions = [
        ...recipeSuggestions,
        ...categorySuggestions,
        ...ingredientSuggestions,
        ...smartSuggestions,
        ...advancedSearchSuggestion
    ].sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

    // Popular recipes for display
    const popularRecipes: PopularRecipe[] = popularRecipesData?.data?.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        category: recipe.category,
        difficulty: recipe.difficulty,
        cookTime: recipe.cook_time,
        likes: Math.floor(Math.random() * 50) + 5, // Mock likes data
        image: recipe.image_url,
    })) || [];

    // Popular searches from categories
    const popularSearches = categories?.slice(0, 6).map(category => ({
        label: category,
        category: category,
        icon: Tag,
    })) || [
            { label: 'Main Course', category: 'Main Course', icon: Tag },
            { label: 'Dessert', category: 'Dessert', icon: Tag },
            { label: 'Salad', category: 'Salad', icon: Tag },
            { label: 'Breakfast', category: 'Breakfast', icon: Tag },
            { label: 'Soup', category: 'Soup', icon: Tag },
            { label: 'Appetizer', category: 'Appetizer', icon: Tag },
        ];

    // Enhanced quick filter suggestions
    const quickFilters = [
        { label: 'Easy', type: 'difficulty', value: 'Easy', icon: Zap, color: 'green' },
        { label: 'Quick (≤30min)', type: 'cookTime', value: '30', icon: Clock, color: 'blue' },
        { label: 'Popular', type: 'sort', value: 'popular', icon: TrendingUp, color: 'purple' },
        { label: 'Recent', type: 'sort', value: 'recent', icon: Sparkles, color: 'orange' },
        { label: 'Favorites', type: 'favorites', value: 'true', icon: Heart, color: 'red' },
        { label: 'Saved', type: 'saved', value: 'true', icon: Bookmark, color: 'yellow' },
    ];

    // Enhanced keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

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
                    handleSearchSubmit(e as any);
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                setShowAdvancedMode(!showAdvancedMode);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedSuggestionIndex, allSuggestions, searchQuery, showAdvancedMode]);

    // Cleanup body overflow
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Focus search input when opened
    useEffect(() => {
        if (isOpen) {
            const searchInput = document.getElementById('global-search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }, [isOpen]);

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

            // Determine target tab based on search context
            let targetTab = 'browse';
            const lowerQuery = searchQuery.toLowerCase();

            // If search contains "my" or "mine", route to My Recipes tab
            if (lowerQuery.includes('my ') || lowerQuery.includes('mine') || lowerQuery.includes('i made') || lowerQuery.includes('i created')) {
                targetTab = 'my-recipes';
                params.set('user_id', 'current');
            }

            // Navigate to appropriate tab with filters
            navigate(`/app?tab=${targetTab}&${params.toString()}`);
            onClose();
        }
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        if (suggestion.type === 'recipe') {
            // Navigate to recipe detail within ModernApp
            navigate(`/app?tab=browse&recipe=${suggestion.id}`);
        } else if (suggestion.type === 'category') {
            // Navigate to browse tab with category filter
            navigate(`/app?tab=browse&category=${encodeURIComponent(suggestion.title)}`);
        } else if (suggestion.type === 'ingredient') {
            // Navigate to browse tab with ingredient search
            navigate(`/app?tab=browse&search=${encodeURIComponent(suggestion.title)}`);
        } else if (suggestion.type === 'advanced') {
            // Navigate to browse tab with search query and focus on filters
            const params = new URLSearchParams();
            if (searchQuery.trim()) {
                const parsed = parseSearchQuery(searchQuery.trim());
                if (parsed.searchTerm) params.set('search', parsed.searchTerm);
                if (parsed.category) params.set('category', parsed.category);
                if (parsed.difficulty) params.set('difficulty', parsed.difficulty);
                if (parsed.cookTime) params.set('cookTime', parsed.cookTime);
            }
            params.set('showFilters', 'true'); // Signal to show filters panel
            navigate(`/app?tab=browse&${params.toString()}`);
        } else if (suggestion.type === 'smart') {
            // Navigate to browse tab with the smart suggestion query
            navigate(`/app?tab=browse&search=${encodeURIComponent(suggestion.title)}`);
        }

        // Save to recent searches
        saveRecentSearch(suggestion.title);
        onClose();
    };

    const handleQuickFilterClick = (filter: any) => {
        const params = new URLSearchParams();
        let targetTab = 'browse'; // Default to browse tab

        if (filter.type === 'difficulty') {
            params.set('difficulty', filter.value);
        } else if (filter.type === 'cookTime') {
            params.set('cookTime', filter.value);
        } else if (filter.type === 'sort') {
            if (filter.value === 'popular') {
                params.set('sortBy', 'likes');
                params.set('sortOrder', 'desc');
            } else if (filter.value === 'recent') {
                params.set('sortBy', 'created_at');
                params.set('sortOrder', 'desc');
            }
        } else if (filter.type === 'category') {
            params.set('category', filter.value);
        } else if (filter.type === 'favorites') {
            params.set('liked', 'true');
        } else if (filter.type === 'saved') {
            params.set('saved', 'true');
        } else if (filter.type === 'my-recipes') {
            // Route to My Recipes tab for user's own recipes
            targetTab = 'my-recipes';
            params.set('user_id', 'current');
        } else if (filter.type === 'trending') {
            params.set('sortBy', 'likes');
            params.set('sortOrder', 'desc');
        }

        navigate(`/app?tab=${targetTab}&${params.toString()}`);
        onClose();
    };

    const handleRecentSearchClick = (recentSearch: RecentSearch) => {
        const params = new URLSearchParams();
        params.set('search', recentSearch.query);

        if (recentSearch.filters) {
            Object.entries(recentSearch.filters).forEach(([key, value]) => {
                if (value) params.set(key, String(value));
            });
        }

        navigate(`/app?tab=browse&${params.toString()}`);
        onClose();
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
    };

    const handleExampleClick = (example: string) => {
        setSearchQuery(example);
        // Auto-submit the example search
        const parsed = parseSearchQuery(example);
        const params = new URLSearchParams();
        if (parsed.searchTerm) params.set('search', parsed.searchTerm);
        if (parsed.category) params.set('category', parsed.category);
        if (parsed.difficulty) params.set('difficulty', parsed.difficulty);
        if (parsed.cookTime) params.set('cookTime', parsed.cookTime);

        navigate(`/app?tab=browse&${params.toString()}`);
        onClose();
    };

    // Function to get theme-aware pill color for suggestion types
    const getSuggestionPillColor = (type: string) => {
        switch (type) {
            case 'recipe':
                return getThemeBadgeClasses(theme.color, 'primary');
            case 'category':
                return getThemeBadgeClasses(theme.color === 'default' ? 'ocean' : theme.color, 'secondary');
            case 'ingredient':
                return getThemeBadgeClasses('forest', 'primary');
            case 'smart':
                return getThemeBadgeClasses('royal', 'primary');
            case 'advanced':
                return getThemeBadgeClasses('ocean', 'primary');
            default:
                return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    // Function to get theme-aware filter pill color
    const getFilterPillColor = (type: string) => {
        switch (type) {
            case 'category':
                return getThemeBadgeClasses('ocean', 'primary');
            case 'difficulty':
                return getThemeBadgeClasses('forest', 'primary');
            case 'cookTime':
                return getThemeBadgeClasses('royal', 'primary');
            default:
                return getThemeBadgeClasses(theme.color, 'primary');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-full flex items-start justify-center p-4 pt-16">
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header - Updated with theme gradient */}
                    <div className={cn(
                        "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700",
                        getThemeBackgroundColor(theme.color, 'light')
                    )}>
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                getThemeGradient(theme.color)
                            )}>
                                <Search className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Smart Recipe Search
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Find recipes with natural language and smart filters
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Search Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                        <form onSubmit={handleSearchSubmit} className="relative mb-8" autoComplete="off">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    id="global-search-input"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for recipes, ingredients, or categories..."
                                    className={cn(
                                        "w-full pl-14 pr-24 py-4 rounded-2xl text-lg font-medium shadow-sm",
                                        "bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700",
                                        "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                                        "focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200",
                                        `focus:ring-${getThemeColors(theme.color).primary} dark:focus:ring-${getThemeColors(theme.color).primaryDark}`
                                    )}
                                    autoComplete="off"
                                    spellCheck="false"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                />
                                {/* Keyboard shortcuts */}
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 flex items-center space-x-2">
                                    <kbd className={cn(
                                        "px-2 py-1 rounded-md font-mono",
                                        "bg-gray-200 dark:bg-gray-700"
                                    )}>⌘K</kbd>
                                    <span>•</span>
                                    <span>Enter to search</span>
                                </div>
                            </div>

                            {/* Enhanced smart filter preview - Updated with theme-aware pills */}
                            {(parsedQuery.category || parsedQuery.difficulty || parsedQuery.cookTime) && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {parsedQuery.category && (
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border",
                                            getFilterPillColor('category'),
                                            "border-blue-200 dark:border-blue-800"
                                        )}>
                                            <Tag className="h-3 w-3 mr-1.5" />
                                            {parsedQuery.category}
                                        </span>
                                    )}
                                    {parsedQuery.difficulty && (
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border",
                                            getFilterPillColor('difficulty'),
                                            "border-green-200 dark:border-green-800"
                                        )}>
                                            <Filter className="h-3 w-3 mr-1.5" />
                                            {parsedQuery.difficulty}
                                        </span>
                                    )}
                                    {parsedQuery.cookTime && (
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border",
                                            getFilterPillColor('cookTime'),
                                            "border-purple-200 dark:border-purple-800"
                                        )}>
                                            <Clock className="h-3 w-3 mr-1.5" />
                                            ≤ {parsedQuery.cookTime}min
                                        </span>
                                    )}
                                </div>
                            )}

                            {searchQuery.length > 0 && (
                                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>Press Tab for advanced mode</span>
                                    <span className="flex items-center gap-1">
                                        <kbd className={cn(
                                            "px-1.5 py-0.5 rounded text-xs",
                                            "bg-gray-200 dark:bg-gray-700"
                                        )}>Tab</kbd>
                                        Advanced
                                    </span>
                                </div>
                            )}

                            {/* Enhanced search suggestions - only show when actively typing */}
                            {allSuggestions.length > 0 && searchQuery.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-3 z-30 animate-fade-in">
                                    <div className={cn(
                                        "glass-card shadow-2xl rounded-2xl backdrop-blur-xl relative overflow-hidden",
                                        "bg-white/80 dark:bg-gray-900/80",
                                        `border border-${getThemeColors(theme.color).primary}-200/60 dark:border-${getThemeColors(theme.color).primary}-700/60`
                                    )}>
                                        {/* Accent bar - Updated with theme gradient */}
                                        <div className={cn(
                                            "absolute left-0 top-0 h-full w-1 rounded-l-2xl",
                                            getThemeGradient(theme.color)
                                        )} />
                                        <div className="px-4 py-2 border-b border-transparent flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className={cn("h-5 w-5", getThemeTextColor(theme.color))} />
                                                <span className="text-base font-bold text-gray-800 dark:text-gray-100 tracking-tight">Smart Suggestions</span>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">↑↓ navigate • Enter select</span>
                                        </div>
                                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {allSuggestions.map((suggestion, index) => {
                                                const Icon = suggestion.icon;
                                                const isSelected = selectedSuggestionIndex === index;
                                                const pillColor = getSuggestionPillColor(suggestion.type);
                                                return (
                                                    <button
                                                        key={suggestion.id}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className={cn(
                                                            'w-full flex items-center gap-4 px-4 py-3 transition-all duration-200 group relative focus:outline-none',
                                                            isSelected ?
                                                                `bg-gradient-to-r from-${getThemeColors(theme.color).primary}-100/80 to-${getThemeColors(theme.color).secondary}-100/80 dark:from-${getThemeColors(theme.color).primary}-900/40 dark:to-${getThemeColors(theme.color).secondary}-900/40 scale-[1.02] shadow-lg ring-2 ring-${getThemeColors(theme.color).primary}-400 dark:ring-${getThemeColors(theme.color).primary}-600 z-10` :
                                                                'hover:bg-gray-50 dark:hover:bg-gray-800',
                                                            'rounded-xl my-1 mx-2'
                                                        )}
                                                        tabIndex={0}
                                                        aria-selected={isSelected}
                                                    >
                                                        <div className={cn(
                                                            'flex-shrink-0 flex items-center justify-center rounded-full shadow-md',
                                                            isSelected ?
                                                                `bg-${getThemeColors(theme.color).primary}-200 dark:bg-${getThemeColors(theme.color).primary}-800` :
                                                                'bg-gray-100 dark:bg-gray-800',
                                                            'h-10 w-10'
                                                        )}>
                                                            <Icon className={cn(
                                                                'h-5 w-5',
                                                                isSelected ?
                                                                    `text-${getThemeColors(theme.color).primary}-700 dark:text-${getThemeColors(theme.color).primary}-200` :
                                                                    'text-gray-600 dark:text-gray-400'
                                                            )} />
                                                        </div>
                                                        <div className="flex-1 min-w-0 text-left">
                                                            <p className={cn(
                                                                'font-bold text-base truncate',
                                                                isSelected ?
                                                                    `text-${getThemeColors(theme.color).primary}-900 dark:text-${getThemeColors(theme.color).primary}-100` :
                                                                    'text-gray-900 dark:text-gray-50'
                                                            )}>
                                                                {suggestion.title}
                                                            </p>
                                                            {suggestion.description && (
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 font-medium">{suggestion.description}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1 min-w-[60px]">
                                                            {suggestion.metadata?.likes && (
                                                                <span className="text-[10px] flex items-center gap-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200 px-1.5 py-0.5 rounded-full font-semibold">
                                                                    <Heart className="h-3 w-3" />
                                                                    {suggestion.metadata.likes}
                                                                </span>
                                                            )}
                                                            <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold capitalize shadow-sm', pillColor)}>
                                                                {suggestion.type}
                                                            </span>
                                                        </div>
                                                        {isSelected && (
                                                            <span className={cn(
                                                                "absolute left-0 top-0 h-full w-1 rounded-l-xl animate-pulse",
                                                                getThemeBackgroundColor(theme.color)
                                                            )} />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Enhanced content - only show when not actively searching */}
                        {searchQuery.length === 0 && (
                            <div className="space-y-8">
                                {/* Quick Filters Row - Enhanced design with theme colors */}
                                <div className="flex items-center space-x-4 flex-wrap gap-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Quick Filters:</span>
                                    {quickFilters.map((filter) => (
                                        <button
                                            key={filter.label}
                                            onClick={() => handleQuickFilterClick(filter)}
                                            className={cn(
                                                "flex items-center space-x-1.5 px-3 py-1.5 text-sm transition-all duration-200 rounded-lg",
                                                "text-gray-700 dark:text-gray-300",
                                                `hover:${getThemeTextColor(theme.color)}`,
                                                "hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
                                            )}
                                        >
                                            <filter.icon className={cn(
                                                "h-4 w-4",
                                                `group-hover:${getThemeTextColor(theme.color)}`
                                            )} />
                                            <span>{filter.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Main Content Area - Enhanced Asymmetric Layout */}
                                <div className="grid grid-cols-12 gap-8">
                                    {/* Large Featured Section - Categories & Popular */}
                                    <div className="col-span-12 md:col-span-8 space-y-8">
                                        {/* Categories - Updated with theme colors */}
                                        <div className={cn(
                                            "rounded-2xl p-8",
                                            getThemeBackgroundColor('sunset', 'light')
                                        )}>
                                            <div className="flex items-center space-x-3 mb-6">
                                                <Tag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    Browse Categories
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {popularSearches.map((item) => (
                                                    <button
                                                        key={item.category}
                                                        onClick={() => navigate(`/app?tab=browse&category=${encodeURIComponent(item.category)}`)}
                                                        className={cn(
                                                            "text-left p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-200",
                                                            "border border-gray-200 dark:border-gray-700",
                                                            `hover:border-${getThemeColors('sunset').primary}-300 dark:hover:border-${getThemeColors('sunset').primary}-600`,
                                                            "hover:-translate-y-1 group"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className={cn(
                                                                "font-semibold text-gray-800 dark:text-gray-200",
                                                                `group-hover:text-${getThemeColors('sunset').primary}-600 dark:group-hover:text-${getThemeColors('sunset').primary}-400`
                                                            )}>
                                                                {item.label}
                                                            </span>
                                                            <ArrowRight className={cn(
                                                                "h-4 w-4 text-gray-400",
                                                                `group-hover:text-${getThemeColors('sunset').primary}-500`,
                                                                "transition-colors"
                                                            )} />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Popular Recipes */}
                                        {popularRecipes.length > 0 && (
                                            <div>
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <TrendingUp className={cn("h-6 w-6", getThemeTextColor(theme.color))} />
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                        Trending Now
                                                    </h3>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {popularRecipes.slice(0, 4).map((recipe) => (
                                                        <button
                                                            key={recipe.id}
                                                            onClick={() => navigate(`/recipes/${recipe.id}`)}
                                                            className="block p-4 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-xl transition-all duration-200 group border border-gray-200 dark:border-gray-700 text-left"
                                                        >
                                                            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                                                                {recipe.image && (
                                                                    <img
                                                                        src={recipe.image}
                                                                        alt={recipe.title}
                                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                    />
                                                                )}
                                                            </div>
                                                            <h4 className={cn(
                                                                "font-bold text-gray-900 dark:text-gray-100 truncate",
                                                                `group-hover:${getThemeTextColor(theme.color)}`
                                                            )}>
                                                                {recipe.title}
                                                            </h4>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {recipe.cookTime}min • {recipe.difficulty}
                                                                </p>
                                                                <div className="flex items-center gap-1">
                                                                    <Heart className={cn(
                                                                        "h-3 w-3",
                                                                        getThemeTextColor('sunset')
                                                                    )} />
                                                                    <span className="text-xs text-gray-500">{recipe.likes}</span>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side - Enhanced Stacked Sections */}
                                    <div className="col-span-12 md:col-span-4 space-y-6">
                                        {/* Pro Tip - Updated with theme colors */}
                                        <div className={cn(
                                            "rounded-2xl p-6",
                                            getThemeBackgroundColor('forest', 'light')
                                        )}>
                                            <div className="flex items-center space-x-3 mb-4">
                                                <Lightbulb className={cn(
                                                    "h-5 w-5",
                                                    getThemeTextColor('forest')
                                                )} />
                                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                    Pro Tip
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                Use natural language like "easy 30-minute dinners" or "healthy chocolate desserts" for smarter results!
                                            </p>
                                        </div>

                                        {/* Recent Searches */}
                                        {recentSearches.length > 0 && (
                                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-2">
                                                        <History className="h-5 w-5 text-gray-500" />
                                                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                            Recent Searches
                                                        </h3>
                                                    </div>
                                                    <button
                                                        onClick={clearRecentSearches}
                                                        className={cn(
                                                            "text-xs font-medium transition-colors",
                                                            "text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                                                        )}
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {recentSearches.slice(0, 5).map((search) => (
                                                        <button
                                                            key={search.id}
                                                            onClick={() => handleRecentSearchClick(search)}
                                                            className={cn(
                                                                "block w-full text-left text-sm text-gray-600 dark:text-gray-400",
                                                                `hover:${getThemeTextColor(theme.color)}`,
                                                                "transition-colors truncate py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            )}
                                                        >
                                                            {search.query}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Smart Search Examples - Updated with theme colors */}
                                        <div className={cn(
                                            "rounded-2xl p-6",
                                            getThemeBackgroundColor(theme.color, 'light')
                                        )}>
                                            <div className="flex items-center space-x-3 mb-4">
                                                <Sparkles className={cn("h-5 w-5", getThemeTextColor(theme.color))} />
                                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                    Try Smart Search
                                                </h3>
                                            </div>
                                            <div className="space-y-2">
                                                {[
                                                    'easy chicken recipes',
                                                    'quick dessert ideas',
                                                    'healthy salads',
                                                    'comfort food dinners'
                                                ].map((example) => (
                                                    <button
                                                        key={example}
                                                        onClick={() => handleExampleClick(example)}
                                                        className={cn(
                                                            "block w-full text-left text-sm",
                                                            "text-gray-600 dark:text-gray-400",
                                                            `hover:${getThemeTextColor(theme.color)}`,
                                                            "transition-colors py-1 px-2 rounded",
                                                            "hover:bg-white dark:hover:bg-gray-700",
                                                            `hover:shadow-sm hover:border-${getThemeColors(theme.color).primary}-200 dark:hover:border-${getThemeColors(theme.color).primary}-700`
                                                        )}
                                                    >
                                                        "{example}"
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
        </div>
    );
}; 