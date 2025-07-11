import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Users, ChefHat } from 'lucide-react';
import { Recipe } from '@recipe-manager/shared';
import { Card, Badge } from '../../../ui';

interface RecipeListItemProps {
    recipe: Recipe;
}

export const RecipeListItem = memo<RecipeListItemProps>(({ recipe }) => {
    const getDifficultyVariant = (difficulty?: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'success';
            case 'Medium':
                return 'warning';
            case 'Hard':
                return 'danger';
            default:
                return 'default';
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    {recipe.image_url ? (
                        <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ChefHat className="h-8 w-8 text-gray-400" data-testid="recipe-fallback-icon" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        <Link to={`/recipes/${recipe.id}`} className="hover:text-blue-600">
                            {recipe.title}
                        </Link>
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Users className="h-4 w-4 mr-1" />
                        <span>By {recipe.user?.name || 'Unknown'}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {recipe.instructions.substring(0, 150)}...
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{recipe.cook_time || 'N/A'} mins</span>
                            </div>
                            <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1" />
                                <span>4.5</span>
                            </div>
                        </div>

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
                    </div>
                </div>
            </div>
        </Card>
    );
});

RecipeListItem.displayName = 'RecipeListItem'; 