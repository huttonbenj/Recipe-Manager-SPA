import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChefHat, Users, Star, Eye } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Badge } from '../../../ui/Badge';
import { cn } from '../../../../utils/cn';

interface RecipeCardProps {
    recipe: Recipe;
    className?: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { id, title, image_url, cook_time = 0, servings = 0, category, difficulty } = recipe;

    const getDifficultyBadgeVariant = (): 'success' | 'warning' | 'error' | 'secondary' => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'success';
            case 'medium': return 'warning';
            case 'hard': return 'error';
            default: return 'secondary';
        }
    };

    return (
        <Link to={`/recipes/${id}`} className={cn("group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl card-interactive hover-float transition-all duration-300", className)}>
            {/* Image & Background */}
            <div className="absolute inset-0">
                {image_url && !imageError ? (
                    <>
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-surface-800 animate-pulse" />
                        )}
                        <img
                            src={image_url}
                            alt={title}
                            className={cn(
                                "h-full w-full object-cover transition-all duration-500 group-hover:scale-110",
                                imageLoaded ? "opacity-100" : "opacity-0"
                            )}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            loading="lazy"
                        />
                    </>
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-800 to-surface-900">
                        <ChefHat className="h-16 w-16 text-surface-600" />
                    </div>
                )}
            </div>

            {/* Combined Content and Hover Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-all duration-300">
                {/* Top section: Difficulty & Rating (visible on hover) */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {difficulty && (
                        <Badge
                            variant={getDifficultyBadgeVariant()}
                            size="sm"
                            className="shadow-lg"
                        >
                            {difficulty}
                        </Badge>
                    )}
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-white font-medium">4.8</span>
                    </div>
                </div>

                {/* Middle section: View button (visible on hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white">
                        <Eye className="h-5 w-5" />
                        <span className="font-semibold">View Recipe</span>
                    </div>
                </div>

                {/* Bottom section: Always visible content and hover details */}
                <div className="p-6 transform transition-all duration-300 group-hover:-translate-y-2">
                    {category && (
                        <Badge
                            variant="outline"
                            size="sm"
                            className="mb-2 bg-white/10 border-white/20 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1"
                        >
                            {category}
                        </Badge>
                    )}
                    <h3 className="text-2xl font-bold text-white leading-tight line-clamp-2" title={title}>
                        {title}
                    </h3>
                    {/* Additional info revealed on hover */}
                    <div className="mt-2 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                        <div className="flex items-center gap-4 text-white/80">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">{cook_time} min</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="text-sm font-medium">{servings} servings</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export const RecipeCardSkeleton = () => (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-surface-800 animate-pulse" />
); 