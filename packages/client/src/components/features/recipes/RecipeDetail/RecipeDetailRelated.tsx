import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../ui';
import { cn } from '../../../../utils/cn';
import { Link } from 'react-router-dom';

export const RecipeDetailRelated: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Mock related recipes - in a real app, these would come from an API call
    const mockRelatedRecipes = [
        {
            id: 'rec1',
            title: 'Italian Pasta Carbonara',
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
            category: 'Italian',
            difficulty: 'Medium'
        },
        {
            id: 'rec2',
            title: 'Vegetarian Stir Fry',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            category: 'Vegetarian',
            difficulty: 'Easy'
        },
        {
            id: 'rec3',
            title: 'Classic Cheesecake',
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            category: 'Dessert',
            difficulty: 'Hard'
        }
    ];

    return (
        <Card className="modern-card rounded-xl hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-900">
            <CardHeader className="pb-4 border-b border-surface-200/50 dark:border-surface-700/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/80 dark:to-pink-900/80 backdrop-blur-sm shadow-sm">
                            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                            You might also like
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleExpand}
                            className="p-1.5 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                            aria-label={isExpanded ? "Collapse related recipes" : "Expand related recipes"}
                        >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mockRelatedRecipes.map((recipe, index) => (
                            <Link
                                to={`/recipes/${recipe.id}`}
                                key={recipe.id}
                                className="group animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="rounded-lg overflow-hidden bg-surface-50/80 dark:bg-surface-800/50 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                                    <div className="relative h-40 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-2 right-2 z-20">
                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-full text-white backdrop-blur-sm",
                                                recipe.difficulty === 'Easy' ? "bg-green-500/70" :
                                                    recipe.difficulty === 'Medium' ? "bg-yellow-500/70" : "bg-red-500/70"
                                            )}>
                                                {recipe.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <span className="text-xs text-surface-500 dark:text-surface-400 mb-1">
                                            {recipe.category}
                                        </span>
                                        <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-2 line-clamp-2">
                                            {recipe.title}
                                        </h4>
                                        <div className="mt-auto flex items-center justify-end text-xs text-brand-600 dark:text-brand-400 font-medium">
                                            <span className="group-hover:mr-1 transition-all duration-300">View recipe</span>
                                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-surface-200/50 dark:border-surface-700/50 flex justify-center">
                        <Link
                            to="/recipes"
                            className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                            <span>Browse all recipes</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}; 