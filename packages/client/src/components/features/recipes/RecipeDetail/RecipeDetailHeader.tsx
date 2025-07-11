import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, Heart, Share2, Clock, Star, Users, ChevronLeft } from 'lucide-react';
import { Button } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';
import { cn } from '../../../../utils/cn';

interface RecipeDetailHeaderProps {
    recipe: Recipe;
    user: any;
    isLiked: boolean;
    onLikeToggle: () => void;
    onDelete: () => void;
}

export const RecipeDetailHeader: React.FC<RecipeDetailHeaderProps> = ({
    recipe,
    user,
    isLiked,
    onLikeToggle,
    onDelete,
}) => {
    const navigate = useNavigate();

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipe.title,
                    text: `Check out this delicious recipe: ${recipe.title}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="mb-8 animate-fade-in">
            {/* Back Button - Enhanced with better hover effect */}
            <button
                onClick={() => navigate('/recipes')}
                className="group flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300 mb-6 hover:-translate-x-1"
                aria-label="Back to recipes"
            >
                <div className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900 transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                </div>
                <span className="font-medium">Back to Recipes</span>
            </button>

            {/* Main Header - Enhanced with modern-card style */}
            <div className="modern-card rounded-xl p-8 mb-6 animate-fade-in-up">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Recipe Title & Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4 gradient-text leading-tight">
                            {recipe.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-semibold shadow-md">
                                    {recipe.user?.name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p className="text-surface-900 dark:text-surface-100 font-medium">
                                        {recipe.user?.name || 'Anonymous Chef'}
                                    </p>
                                    <p className="text-surface-600 dark:text-surface-400 text-sm">
                                        Recipe Creator
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats - Enhanced with improved visual style */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            {recipe.cook_time && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-100/80 dark:bg-surface-800/80 backdrop-blur-sm shadow-sm">
                                    <Clock className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                                    <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                                        {recipe.cook_time} min
                                    </span>
                                </div>
                            )}
                            {recipe.servings && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-100/80 dark:bg-surface-800/80 backdrop-blur-sm shadow-sm">
                                    <Users className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                                    <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                                        {recipe.servings} servings
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-100/80 dark:bg-surface-800/80 backdrop-blur-sm shadow-sm">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                                    4.8 rating
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Fixed layout and styling */}
                    <div className="flex flex-col gap-3 sm:flex-row lg:items-start lg:justify-end min-w-[220px]">
                        <div className="flex gap-3 w-full justify-end">
                            <Button
                                variant={isLiked ? "primary" : "outline"}
                                onClick={onLikeToggle}
                                className={cn(
                                    "transition-all duration-300 shadow-sm",
                                    isLiked ?
                                        "bg-brand-600 hover:bg-brand-700 text-white" :
                                        "hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 dark:hover:border-brand-700"
                                )}
                                size="md"
                                rounded="full"
                                leftIcon={<Heart className={cn("transition-all duration-300", isLiked && "fill-current")} />}
                                aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
                            >
                                {isLiked ? 'Liked' : 'Like'}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleShare}
                                className="hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 dark:hover:border-brand-700 transition-all duration-300 shadow-sm"
                                size="md"
                                rounded="full"
                                leftIcon={<Share2 />}
                                aria-label="Share recipe"
                            >
                                Share
                            </Button>
                        </div>

                        {/* Owner Actions - Fixed layout and styling */}
                        {user && user.id === recipe.user_id && (
                            <div className="flex gap-3 w-full justify-end">
                                <Link
                                    to={`/recipes/${recipe.id}/edit`}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full border border-surface-300 bg-transparent hover:border-brand-300 hover:bg-brand-50 dark:border-surface-700 dark:text-surface-50 dark:hover:bg-brand-900/30 dark:hover:border-brand-700 transition-all duration-300 shadow-sm gap-2"
                                    aria-label="Edit recipe"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={onDelete}
                                    size="md"
                                    rounded="full"
                                    leftIcon={<Trash2 className="h-4 w-4" />}
                                    className="hover:border-error-300 hover:bg-error-50 dark:hover:bg-error-900/30 dark:hover:border-error-700 hover:text-error-600 dark:hover:text-error-400 transition-all duration-300 shadow-sm"
                                    aria-label="Delete recipe"
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 