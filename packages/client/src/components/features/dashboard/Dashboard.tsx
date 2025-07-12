import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useDashboard } from '../../../hooks/user/useDashboard';
import { cn } from '../../../utils/cn';
import {
    ChefHat, PlusCircle, Heart, Clock, Search,
    Star, ChevronRight, Bookmark,
    Utensils, Award, Leaf, TrendingUp, BookOpen
} from 'lucide-react';
import { DashboardInsights } from './DashboardInsights';
import { DashboardActivity } from './DashboardActivity';

// Memoized components for better performance
const MemoizedDashboardInsights = React.memo(DashboardInsights);
const MemoizedDashboardActivity = React.memo(DashboardActivity);

// Extended Recipe type with analytics properties
interface RecipeWithAnalytics {
    id: string;
    title: string;
    likes_count?: number;
    rating?: number;
    views_count?: number;
    image_url?: string;
    cook_time?: number;
    category?: string;
}

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const {
        userRecipes,
        communityRecipes,
        activities,
        isLoading,
        userStats,
        statsLoading,
        isFavorite,
        toggleFavorite
    } = useDashboard();

    // Use stats from API or fallback to calculated values
    const stats = React.useMemo(() => ({
        totalRecipes: userStats?.totalRecipes || userRecipes.length,
        totalLikes: userStats?.totalLikes || 0,
        averageRating: userStats?.averageRating || 0,
        totalViews: userStats?.totalViews || 0,
    }), [userStats, userRecipes.length]);

    // Memoized categories data with improved icons
    const categories = React.useMemo(() => [
        { name: 'Breakfast', icon: <Utensils className="h-5 w-5" />, color: 'from-amber-500 to-amber-600', count: 12 },
        { name: 'Desserts', icon: <Leaf className="h-5 w-5" />, color: 'from-pink-500 to-pink-600', count: 24 },
        { name: 'Healthy', icon: <Leaf className="h-5 w-5" />, color: 'from-green-500 to-green-600', count: 18 },
        { name: 'Quick', icon: <Clock className="h-5 w-5" />, color: 'from-blue-500 to-blue-600', count: 9 }
    ], []);

    // Format current day
    const formattedDate = React.useMemo(() => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        }).format(new Date());
    }, []);

    // Get greeting based on time of day
    const greeting = React.useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-950">
            {/* Enhanced decorative background elements with subtle animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-[10%] right-[5%] w-72 h-72 bg-brand-500/5 blur-[100px] rounded-full animate-pulse-slow"></div>
                <div className="absolute top-[40%] left-[10%] w-64 h-64 bg-accent-500/5 blur-[100px] rounded-full animate-pulse-slow animation-delay-1000"></div>
                <div className="absolute bottom-[10%] right-[15%] w-48 h-48 bg-purple-500/5 blur-[100px] rounded-full animate-pulse-slow animation-delay-2000"></div>
            </div>

            {/* Main content container */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 md:py-12">
                {/* Refined header section with improved glass effect */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-md rounded-2xl border border-surface-200/50 dark:border-surface-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Left side - Greeting with enhanced animation */}
                            <div className="flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                                        <ChefHat className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-surface-600 dark:text-surface-400 mb-1">{formattedDate}</div>
                                        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                                            {greeting}, <span className="text-brand-600 dark:text-brand-400">{user?.name || 'Chef'}</span>
                                        </h1>
                                        <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
                                            Ready to cook something amazing today?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Quick Actions with improved hover effects */}
                            <div className="lg:w-auto">
                                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 lg:text-right">Quick Actions</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    <Link
                                        to="/recipes/new"
                                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 transition-all duration-200 hover:scale-105 hover:shadow-md"
                                        aria-label="Create new recipe"
                                    >
                                        <PlusCircle className="h-5 w-5 mb-1" />
                                        <span className="text-xs font-medium">New</span>
                                    </Link>
                                    <Link
                                        to="/recipes"
                                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-accent-500/10 hover:bg-accent-500/20 text-accent-600 dark:text-accent-400 transition-all duration-200 hover:scale-105 hover:shadow-md"
                                        aria-label="Search recipes"
                                    >
                                        <Search className="h-5 w-5 mb-1" />
                                        <span className="text-xs font-medium">Search</span>
                                    </Link>
                                    <Link
                                        to="/recipes?filter=favorites"
                                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all duration-200 hover:scale-105 hover:shadow-md"
                                        aria-label="View favorite recipes"
                                    >
                                        <Heart className="h-5 w-5 mb-1" />
                                        <span className="text-xs font-medium">Favs</span>
                                    </Link>
                                    <Link
                                        to="/recipes?filter=saved"
                                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-all duration-200 hover:scale-105 hover:shadow-md"
                                        aria-label="View saved recipes"
                                    >
                                        <Bookmark className="h-5 w-5 mb-1" />
                                        <span className="text-xs font-medium">Saved</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Stats row with improved spacing and animations */}
                        <div className="mt-6 pt-6 border-t border-surface-200/50 dark:border-surface-800/50">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-surface-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">{stats.totalRecipes}</div>
                                        <div className="text-xs text-surface-600 dark:text-surface-400">Your Recipes</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-surface-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
                                            {statsLoading ? (
                                                <div className="w-8 h-8 bg-surface-200 dark:bg-surface-700 rounded animate-pulse"></div>
                                            ) : (
                                                stats.totalLikes
                                            )}
                                        </div>
                                        <div className="text-xs text-surface-600 dark:text-surface-400">Total Likes</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-surface-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                                            {stats.averageRating.toFixed(1)}
                                        </div>
                                        <div className="text-xs text-surface-600 dark:text-surface-400">Avg Rating</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-surface-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{stats.totalViews}</div>
                                        <div className="text-xs text-surface-600 dark:text-surface-400">Total Views</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content grid with staggered animations */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left column - Recipe collections */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Your recipes section with enhanced hover effects */}
                        <section className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-md rounded-2xl border border-surface-200/50 dark:border-surface-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up animation-delay-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                                        <ChefHat className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                                        Your Recipes
                                    </h2>
                                </div>
                                <Link
                                    to="/recipes?filter=my-recipes"
                                    className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors duration-200 hover:underline"
                                    aria-label="View all your recipes"
                                >
                                    View All
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-48 bg-surface-200/50 dark:bg-surface-800/50 rounded-xl"></div>
                                    ))}
                                </div>
                            ) : userRecipes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {userRecipes.slice(0, 3).map((recipe, index) => (
                                        <Link
                                            key={recipe.id}
                                            to={`/recipes/${recipe.id}`}
                                            className="group relative overflow-hidden rounded-xl aspect-[4/3] shadow-sm hover:shadow-lg transition-all duration-300"
                                            style={{ animationDelay: `${index * 150}ms` }}
                                            aria-label={`View recipe: ${recipe.title}`}
                                        >
                                            <img
                                                src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop&crop=center'}
                                                alt={recipe.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                                                <h3 className="text-white font-semibold line-clamp-1 group-hover:text-brand-300 transition-colors duration-300">{recipe.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-white/80 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {recipe.cook_time} min
                                                    </span>
                                                    <span className="text-xs text-white/80 flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-amber-400" />
                                                        {(recipe as unknown as RecipeWithAnalytics).rating?.toFixed(1) || '0.0'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center">
                                        <ChefHat className="h-8 w-8 text-surface-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">No recipes yet</h3>
                                    <p className="text-surface-600 dark:text-surface-400 mb-4">Create your first recipe to get started</p>
                                    <Link
                                        to="/recipes/new"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Create Recipe
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Community recipes section with improved card design */}
                        <section className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-md rounded-2xl border border-surface-200/50 dark:border-surface-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up animation-delay-600">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                                        <Award className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                                        Community Favorites
                                    </h2>
                                </div>
                                <Link
                                    to="/recipes"
                                    className="flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-500 dark:text-accent-400 transition-colors duration-200 hover:underline"
                                    aria-label="Explore all community recipes"
                                >
                                    Explore
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 gap-4 animate-pulse">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-24 bg-surface-200/50 dark:bg-surface-800/50 rounded-xl"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {communityRecipes.slice(0, 3).map((recipe, index) => (
                                        <Link
                                            key={recipe.id}
                                            to={`/recipes/${recipe.id}`}
                                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-300 group"
                                            style={{ animationDelay: `${index * 150}ms` }}
                                            aria-label={`View recipe: ${recipe.title}`}
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                                                <img
                                                    src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop&crop=center'}
                                                    alt={recipe.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-surface-900 dark:text-white line-clamp-1 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">{recipe.title}</h3>
                                                <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-1">
                                                    {recipe.category || 'Uncategorized'}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {recipe.cook_time} min
                                                    </span>
                                                    <span className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-amber-500" />
                                                        {(recipe as unknown as RecipeWithAnalytics).rating?.toFixed(1) || '0.0'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleFavorite(recipe.id);
                                                }}
                                                className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300 hover:scale-110"
                                                aria-label={isFavorite(recipe.id) ? "Remove from favorites" : "Add to favorites"}
                                            >
                                                <Heart
                                                    className={cn(
                                                        "h-5 w-5",
                                                        isFavorite(recipe.id)
                                                            ? "fill-rose-500 text-rose-500"
                                                            : "text-surface-400"
                                                    )}
                                                />
                                            </button>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Recipe categories with improved visual effects */}
                        <section className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-md rounded-2xl border border-surface-200/50 dark:border-surface-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up animation-delay-900">
                            <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">
                                Browse by Category
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {categories.map((category, index) => (
                                    <Link
                                        key={index}
                                        to={`/recipes?category=${category.name}`}
                                        className="group flex flex-col items-center p-4 rounded-xl bg-gradient-to-br hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md"
                                        style={{
                                            background: `linear-gradient(135deg, var(--${category.color.split('-')[1]}-500-rgb) / 0.1, var(--${category.color.split('-')[3]}-600-rgb) / 0.2)`,
                                            animationDelay: `${index * 150}ms`
                                        }}
                                        aria-label={`Browse ${category.name} recipes`}
                                    >
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
                                            {category.icon}
                                        </div>
                                        <h3 className="font-medium text-surface-900 dark:text-white text-center group-hover:text-opacity-90 transition-all duration-300">
                                            {category.name}
                                        </h3>
                                        <span className="text-sm text-surface-600 dark:text-surface-400">
                                            {category.count} recipes
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right column - Activity and insights with enhanced animations */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Activity feed with improved styling */}
                        <section className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-md rounded-2xl border border-surface-200/50 dark:border-surface-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up animation-delay-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                                    <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                                    Recent Activity
                                </h2>
                            </div>

                            <MemoizedDashboardActivity
                                activities={activities}
                                isLoading={isLoading}
                            />
                        </section>

                        {/* Insights with improved visual appeal */}
                        <section className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-md rounded-2xl border border-surface-200/50 dark:border-surface-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up animation-delay-600">
                            <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">
                                Recipe Insights
                            </h2>

                            <MemoizedDashboardInsights
                                recipeCount={userRecipes.length}
                                mostUsedCategory={userRecipes.length > 0 ? "Dinner" : undefined}
                            />
                        </section>

                        {/* Cooking tips with enhanced gradient background */}
                        <section className="bg-gradient-to-br from-brand-500/10 to-accent-500/10 backdrop-blur-md rounded-2xl border border-surface-200/50 dark:border-surface-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up animation-delay-900">
                            <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                                Cooking Tip
                            </h2>

                            <p className="text-surface-700 dark:text-surface-300 mb-4">
                                Always let meat rest after cooking to allow juices to redistribute, resulting in a more flavorful and tender dish.
                            </p>

                            <Link
                                to="/tips"
                                className="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 flex items-center gap-1 hover:underline transition-colors duration-200"
                                aria-label="View more cooking tips"
                            >
                                More tips
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}; 