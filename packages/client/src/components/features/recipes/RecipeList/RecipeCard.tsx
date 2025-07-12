import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Star, Eye, Users, ChefHat } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Card, Badge } from '../../../ui';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeTextColor } from '../../../../utils/theme';

interface RecipeCardProps {
    recipe: Recipe;
}

export const RecipeCard = memo<RecipeCardProps>(({ recipe }) => {
    const { theme } = useTheme();

    const getDifficultyVariant = (difficulty?: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'success';
            case 'Medium':
                return 'warning';
            case 'Hard':
                return 'error';
            default:
                return 'secondary';
        }
    };

    // Get theme-aware text color classes
    const primaryTextColor = getThemeTextColor(theme.color, 'primary');
    const secondaryTextColor = getThemeTextColor(theme.color, 'secondary');

    return (
        <Card
            className={`overflow-hidden hover:shadow-lg transition-shadow glass-card hover:shadow-${theme.color === 'default' ? 'emerald' : theme.color}-500/15`}
            variant="interactive"
        >
            <div className="relative">
                {recipe.image_url ? (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    <div className={`w-full h-48 bg-surface-200 dark:bg-surface-800 flex items-center justify-center bg-opacity-50`}>
                        <ChefHat className={`h-12 w-12 ${primaryTextColor} opacity-50`} />
                    </div>
                )}
                <div className="absolute top-2 right-2 glass-card rounded-full p-2">
                    <Heart className={`h-4 w-4 hover:${primaryTextColor} text-surface-400 dark:text-surface-500`} />
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2 line-clamp-2">
                    <Link to={`/app?tab=browse&recipe=${recipe.id}`} className={`hover:${primaryTextColor}`}>
                        {recipe.title}
                    </Link>
                </h3>

                <div className="flex items-center text-sm text-surface-500 dark:text-surface-400 mb-3">
                    <Users className="h-4 w-4 mr-1" />
                    <span>By {recipe.user?.name || 'Unknown'}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-surface-500 dark:text-surface-400 mb-3">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{recipe.cook_time || 'N/A'} mins</span>
                    </div>
                    <div className="flex items-center">
                        <Star className={`h-4 w-4 mr-1 ${secondaryTextColor}`} />
                        <span className={secondaryTextColor}>4.5</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {recipe.difficulty && (
                            <Badge variant={getDifficultyVariant(recipe.difficulty)}>
                                {recipe.difficulty}
                            </Badge>
                        )}
                        {recipe.category && (
                            <Badge variant="primary">
                                {recipe.category}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center text-surface-400 dark:text-surface-500">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">125</span>
                    </div>
                </div>
            </div>
        </Card>
    );
});

RecipeCard.displayName = 'RecipeCard'; 