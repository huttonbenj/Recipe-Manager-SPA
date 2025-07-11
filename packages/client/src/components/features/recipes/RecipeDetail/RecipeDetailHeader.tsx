import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Heart, Share2, Clock, Star, Users } from 'lucide-react';
import { Button } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';

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
            {/* Back Button */}
            <button
                onClick={() => navigate('/recipes')}
                className="group flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 mb-6 hover-lift"
            >
                <div className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="font-medium">Back to Recipes</span>
            </button>

            {/* Main Header */}
            <div className="glass-card p-8 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Recipe Title & Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4 gradient-text leading-tight">
                            {recipe.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-semibold">
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

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            {recipe.cook_time && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-100 dark:bg-surface-800">
                                    <Clock className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                                    <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                                        {recipe.cook_time} min
                                    </span>
                                </div>
                            )}
                            {recipe.servings && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-100 dark:bg-surface-800">
                                    <Users className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                                    <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                                        {recipe.servings} servings
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-100 dark:bg-surface-800">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                                    4.8 rating
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-auto">
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                onClick={onLikeToggle}
                                className={`glass-effect group hover:scale-105 transition-all duration-200 ${isLiked
                                        ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                                        : 'hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400'
                                    }`}
                                aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
                            >
                                <Heart className={`h-5 w-5 transition-all duration-200 ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'
                                    }`} />
                                <span className="font-medium">
                                    {isLiked ? 'Liked' : 'Like'}
                                </span>
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={handleShare}
                                className="glass-effect group hover:scale-105 transition-all duration-200 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400"
                            >
                                <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                                <span className="font-medium">Share</span>
                            </Button>
                        </div>

                        {/* Owner Actions */}
                        {user && user.id === recipe.user_id && (
                            <div className="flex gap-3">
                                <Link
                                    to={`/recipes/${recipe.id}/edit`}
                                    className="btn btn-glass flex items-center gap-2 hover:scale-105 transition-all duration-200"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span>Edit</span>
                                </Link>
                                <Button
                                    variant="ghost"
                                    onClick={onDelete}
                                    className="glass-effect group hover:scale-105 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400"
                                >
                                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-medium">Delete</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 