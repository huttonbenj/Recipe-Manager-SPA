import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Heart, Share2 } from 'lucide-react';
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

    return (
        <div className="mb-6">
            <button
                onClick={() => navigate('/recipes')}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Recipes
            </button>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
                    <p className="text-gray-600">By {recipe.user?.name || 'Unknown'}</p>
                </div>

                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={onLikeToggle}
                        className={`flex items-center space-x-2 ${isLiked ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100'
                            }`}
                        aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
                    >
                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>Like</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className="flex items-center space-x-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                        <Share2 className="h-5 w-5" />
                        <span>Share</span>
                    </Button>

                    {user && user.id === recipe.user_id && (
                        <div className="flex space-x-2">
                            <Link
                                to={`/recipes/${recipe.id}/edit`}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Edit className="h-4 w-4" />
                                <span>Edit Recipe</span>
                            </Link>
                            <Button
                                variant="danger"
                                onClick={onDelete}
                                className="flex items-center space-x-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete Recipe</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 