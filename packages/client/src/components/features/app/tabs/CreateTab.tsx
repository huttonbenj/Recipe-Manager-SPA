import React from 'react';
import { RecipeForm } from '../../recipes/RecipeForm';
import { Plus } from 'lucide-react';
import { ThemeGradient } from '../ThemeGradient';

export const CreateTab: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <ThemeGradient className="rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Plus className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1">
                            Create Recipe
                        </h1>
                        <p className="text-white/90">
                            Share your culinary creations with the community
                        </p>
                    </div>
                </div>
            </ThemeGradient>

            {/* Recipe Form with enhanced styling */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <RecipeForm />
            </div>
        </div>
    );
}; 