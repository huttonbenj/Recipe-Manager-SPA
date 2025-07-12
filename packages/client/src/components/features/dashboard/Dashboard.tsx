import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../../hooks/user/useDashboard';
import { useAuth } from '../../../hooks/useAuth';
import { DashboardActivity } from './DashboardActivity';
import { DashboardInsights } from './DashboardInsights';
import {
    ChefHat, BookOpen, Heart, Star, TrendingUp, PlusCircle, Search,
    Utensils, Leaf, Clock, Award, ChevronRight, Sparkles, Zap, Coffee, Cake
} from 'lucide-react';

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
        activities,
        isLoading,
        userStats
    } = useDashboard();

    // Use stats from API or fallback to calculated values
    const stats = React.useMemo(() => ({
        totalRecipes: userStats?.totalRecipes || userRecipes.length,
        totalLikes: userStats?.totalLikes || 0,
        averageRating: userStats?.averageRating || 0,
        totalViews: userStats?.totalViews || 0,
    }), [userStats, userRecipes.length]);

    // Enhanced categories data with better icons and colors
    const categories = React.useMemo(() => [
        { name: 'Breakfast', icon: <Coffee className="h-5 w-5" />, color: 'from-warning-500 to-amber-500', bgColor: 'bg-warning-50 dark:bg-warning-950/20', count: 12 },
        { name: 'Desserts', icon: <Cake className="h-5 w-5" />, color: 'from-error-500 to-pink-500', bgColor: 'bg-error-50 dark:bg-error-950/20', count: 24 },
        { name: 'Healthy', icon: <Leaf className="h-5 w-5" />, color: 'from-success-500 to-emerald-500', bgColor: 'bg-success-50 dark:bg-success-950/20', count: 18 },
        { name: 'Quick', icon: <Zap className="h-5 w-5" />, color: 'from-accent-500 to-blue-500', bgColor: 'bg-accent-50 dark:bg-accent-950/20', count: 9 }
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
        <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-950 dark:via-surface-900 dark:to-surface-800">
            {/* Enhanced decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-brand-500/10 via-accent-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-accent-500/10 via-brand-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-br from-success-500/5 via-emerald-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
            </div>

            {/* Main content container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Enhanced welcome header */}
                <header className="text-center space-y-6 animate-fade-in-up">
                    {/* Date indicator */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                        <div className="px-4 py-2 bg-white/60 dark:bg-surface-900/60 backdrop-blur-sm rounded-full border border-surface-200/50 dark:border-surface-800/50">
                            <p className="text-sm text-surface-600 dark:text-surface-400 font-medium tracking-wider">
                                {formattedDate}
                            </p>
                        </div>
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse animation-delay-300"></div>
                    </div>

                    {/* Main greeting */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-accent-500/10 to-brand-500/10 rounded-3xl blur-2xl"></div>
                        <div className="relative bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-3xl border border-surface-200/50 dark:border-surface-800/50 shadow-2xl p-8">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative p-4 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl shadow-xl">
                                        <ChefHat className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 p-1 bg-gradient-to-br from-accent-400 to-brand-500 rounded-full">
                                        <Sparkles className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-surface-900 via-brand-600 to-surface-900 dark:from-white dark:via-brand-400 dark:to-surface-300 bg-clip-text text-transparent">
                                {greeting}, {user?.name}! 👋
                            </h1>

                            <p className="text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed mb-8">
                                Ready to create something delicious? Your culinary journey continues here.
                            </p>

                            {/* Enhanced quick action buttons */}
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link
                                    to="/recipes/new"
                                    className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-accent-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center gap-3">
                                        <PlusCircle className="h-6 w-6" />
                                        <span className="font-semibold">Create Recipe</span>
                                        <Sparkles className="h-4 w-4 opacity-70" />
                                    </div>
                                </Link>

                                <Link
                                    to="/recipes"
                                    className="group px-8 py-4 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm text-surface-700 dark:text-surface-300 rounded-2xl border border-surface-200/50 dark:border-surface-800/50 hover:border-brand-300 dark:hover:border-brand-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    <div className="flex items-center gap-3">
                                        <Search className="h-6 w-6" />
                                        <span className="font-semibold">Explore Recipes</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Enhanced stats overview */}
                <section className="animate-fade-in-up animation-delay-300">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group relative overflow-hidden bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-2xl p-6 border border-surface-200/50 dark:border-surface-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <BookOpen className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                                            {stats.totalRecipes}
                                        </div>
                                        <p className="text-sm text-surface-600 dark:text-surface-400 font-medium">Your Recipes</p>
                                    </div>
                                </div>
                                <div className="h-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transform translate-x-0 group-hover:translate-x-2 transition-transform duration-500" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-2xl p-6 border border-surface-200/50 dark:border-surface-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-error-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-error-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Heart className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-surface-900 dark:text-white group-hover:text-error-600 dark:group-hover:text-error-400 transition-colors duration-300">
                                            {isLoading ? (
                                                <div className="h-8 w-16 bg-surface-200 dark:bg-surface-700 rounded animate-pulse"></div>
                                            ) : (
                                                stats.totalLikes
                                            )}
                                        </div>
                                        <p className="text-sm text-surface-600 dark:text-surface-400 font-medium">Total Likes</p>
                                    </div>
                                </div>
                                <div className="h-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-error-500 to-pink-600 rounded-full transform translate-x-0 group-hover:translate-x-2 transition-transform duration-500" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-2xl p-6 border border-surface-200/50 dark:border-surface-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-warning-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-warning-500 to-amber-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Star className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-surface-900 dark:text-white group-hover:text-warning-600 dark:group-hover:text-warning-400 transition-colors duration-300">
                                            {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                                        </div>
                                        <p className="text-sm text-surface-600 dark:text-surface-400 font-medium">Avg Rating</p>
                                    </div>
                                </div>
                                <div className="h-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-warning-500 to-amber-600 rounded-full transform translate-x-0 group-hover:translate-x-2 transition-transform duration-500" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-2xl p-6 border border-surface-200/50 dark:border-surface-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-surface-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                                            {stats.totalViews}
                                        </div>
                                        <p className="text-sm text-surface-600 dark:text-surface-400 font-medium">Total Views</p>
                                    </div>
                                </div>
                                <div className="h-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-accent-500 to-blue-600 rounded-full transform translate-x-0 group-hover:translate-x-2 transition-transform duration-500" style={{ width: '90%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Recipe collections */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Your recipes section */}
                        <section className="relative animate-fade-in-up animation-delay-600">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-accent-500/5 to-brand-500/5 rounded-3xl blur-xl"></div>
                            <div className="relative bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-3xl border border-surface-200/50 dark:border-surface-800/50 shadow-2xl p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg">
                                            <ChefHat className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                                                Your Recipes
                                            </h2>
                                            <p className="text-surface-600 dark:text-surface-400">
                                                Your culinary creations
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/recipes?filter=my-recipes"
                                        className="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 hover:bg-brand-100 dark:hover:bg-brand-900/30 text-surface-700 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl transition-all duration-200 group"
                                    >
                                        <span className="font-medium">View All</span>
                                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Link>
                                </div>

                                {isLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="h-64 bg-surface-200/50 dark:bg-surface-800/50 rounded-2xl"></div>
                                        ))}
                                    </div>
                                ) : userRecipes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {userRecipes.slice(0, 3).map((recipe, index) => (
                                            <Link
                                                key={recipe.id}
                                                to={`/recipes/${recipe.id}`}
                                                className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                                                style={{ animationDelay: `${index * 150}ms` }}
                                            >
                                                <img
                                                    src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center'}
                                                    alt={recipe.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-brand-300 transition-colors duration-300">
                                                        {recipe.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-white/80">
                                                        <span className="flex items-center gap-1 text-sm">
                                                            <Clock className="h-4 w-4" />
                                                            {recipe.cook_time}min
                                                        </span>
                                                        <span className="flex items-center gap-1 text-sm">
                                                            <Star className="h-4 w-4 text-amber-400" />
                                                            {(recipe as unknown as RecipeWithAnalytics).rating?.toFixed(1) || '0.0'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/30 dark:to-accent-900/30 rounded-2xl flex items-center justify-center">
                                            <ChefHat className="h-10 w-10 text-brand-600 dark:text-brand-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">No recipes yet</h3>
                                        <p className="text-surface-600 dark:text-surface-400 mb-6">Create your first recipe to get started on your culinary journey</p>
                                        <Link
                                            to="/recipes/new"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-accent-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        >
                                            <PlusCircle className="h-5 w-5" />
                                            Create Your First Recipe
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Recipe categories */}
                        <section className="relative animate-fade-in-up animation-delay-900">
                            <div className="absolute inset-0 bg-gradient-to-r from-success-500/5 via-emerald-500/5 to-success-500/5 rounded-3xl blur-xl"></div>
                            <div className="relative bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-3xl border border-surface-200/50 dark:border-surface-800/50 shadow-2xl p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-success-500 to-emerald-600 shadow-lg">
                                        <Utensils className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                                            Browse Categories
                                        </h2>
                                        <p className="text-surface-600 dark:text-surface-400">
                                            Discover recipes by type
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {categories.map((category, index) => (
                                        <Link
                                            key={index}
                                            to={`/recipes?category=${category.name}`}
                                            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                            style={{ animationDelay: `${index * 150}ms` }}
                                        >
                                            <div className={`absolute inset-0 ${category.bgColor} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                            <div className="relative text-center">
                                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                    <div className="text-white">
                                                        {category.icon}
                                                    </div>
                                                </div>
                                                <h3 className="font-bold text-surface-900 dark:text-white mb-1 group-hover:text-opacity-90 transition-all duration-300">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-surface-600 dark:text-surface-400">
                                                    {category.count} recipes
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right column - Activity and insights */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Activity feed */}
                        <section className="relative animate-fade-in-up animation-delay-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl blur-xl"></div>
                            <div className="relative bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-3xl border border-surface-200/50 dark:border-surface-800/50 shadow-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                                        <TrendingUp className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                                            Recent Activity
                                        </h2>
                                        <p className="text-sm text-surface-600 dark:text-surface-400">
                                            What's happening
                                        </p>
                                    </div>
                                </div>

                                <MemoizedDashboardActivity
                                    activities={activities}
                                    isLoading={isLoading}
                                />
                            </div>
                        </section>

                        {/* Insights */}
                        <section className="relative animate-fade-in-up animation-delay-600">
                            <div className="absolute inset-0 bg-gradient-to-r from-warning-500/5 via-amber-500/5 to-warning-500/5 rounded-3xl blur-xl"></div>
                            <div className="relative bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-3xl border border-surface-200/50 dark:border-surface-800/50 shadow-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-warning-500 to-amber-600 shadow-lg">
                                        <Award className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                                            Recipe Insights
                                        </h2>
                                        <p className="text-sm text-surface-600 dark:text-surface-400">
                                            Your cooking stats
                                        </p>
                                    </div>
                                </div>

                                <MemoizedDashboardInsights
                                    recipeCount={userRecipes.length}
                                    mostUsedCategory={userRecipes.length > 0 ? "Dinner" : undefined}
                                />
                            </div>
                        </section>

                        {/* Cooking tip */}
                        <section className="relative animate-fade-in-up animation-delay-900">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-accent-500/5 to-brand-500/5 rounded-3xl blur-xl"></div>
                            <div className="relative bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-950/20 dark:to-accent-950/20 backdrop-blur-sm rounded-3xl border border-brand-200/50 dark:border-brand-800/50 shadow-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 shadow-lg">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-brand-900 dark:text-brand-100">
                                        Chef's Tip
                                    </h2>
                                </div>

                                <p className="text-brand-800 dark:text-brand-200 mb-4 leading-relaxed">
                                    Always let meat rest after cooking to allow juices to redistribute, resulting in a more flavorful and tender dish.
                                </p>

                                <Link
                                    to="/tips"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors duration-200 group"
                                >
                                    <span>More cooking tips</span>
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}; 