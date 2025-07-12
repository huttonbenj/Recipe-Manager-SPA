import React from 'react';
import { useNavigate } from 'react-router-dom';
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
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            // Consider showing a toast notification here
        }
    };

    return (
        <div>
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 text-surface-300 hover:text-surface-100"
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Recipes
            </Button>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-surface-50 mb-4 leading-tight">
                        {recipe.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src={`https://ui-avatars.com/api/?name=${recipe.user?.name}&background=random`}
                            alt={recipe.user?.name || 'author'}
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <p className="text-surface-100 font-semibold">
                                {recipe.user?.name || 'Anonymous Chef'}
                            </p>
                            <p className="text-surface-400 text-sm">
                                Recipe Creator
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-surface-400">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.cook_time || 0} min</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            <span>{recipe.servings || 0} servings</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>4.8 (25 reviews)</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:self-start">
                    <Button
                        variant="glass"
                        size="sm"
                        onClick={onLikeToggle}
                        aria-label={isLiked ? "Unlike recipe" : "Like recipe"}
                        className={isLiked ? 'text-red-400' : ''}
                        leftIcon={<Heart className={cn("h-4 w-4 transition-colors", isLiked ? "fill-current text-red-400" : "")} />}
                    >
                        {isLiked ? 'Liked' : 'Like'}
                    </Button>

                    <Button
                        variant="glass"
                        size="sm"
                        onClick={handleShare}
                        aria-label="Share recipe"
                        leftIcon={<Share2 className="h-4 w-4" />}
                    >
                        Share
                    </Button>

                    {user && recipe.user && user.id === recipe.user.id && (
                        <>
                            <Button
                                variant="glass"
                                size="sm"
                                onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                                aria-label="Edit recipe"
                                leftIcon={<Edit className="h-4 w-4" />}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={onDelete}
                                aria-label="Delete recipe"
                                leftIcon={<Trash2 className="h-4 w-4" />}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}; 