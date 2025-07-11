import React from 'react';
import { Clock, Users, Tag, Star, ChefHat } from 'lucide-react';
import { RecipeFormData, RECIPE_CONFIG } from '@recipe-manager/shared';
import { Card, CardContent, CardHeader } from '../../../ui/Card';
import { Input, Select, FormField } from '../../../ui/Form';

interface RecipeBasicInfoProps {
    formData: RecipeFormData;
    errors: Partial<RecipeFormData>;
    onUpdateField: (field: keyof RecipeFormData, value: any) => void;
}

export const RecipeBasicInfo: React.FC<RecipeBasicInfoProps> = ({
    formData,
    errors,
    onUpdateField,
}) => {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-green-600 dark:text-green-400';
            case 'Medium':
                return 'text-yellow-600 dark:text-yellow-400';
            case 'Hard':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-surface-600 dark:text-surface-400';
        }
    };

    return (
        <Card className="glass-card hover:shadow-glass-lg transition-all duration-300">
            <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                        <ChefHat className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                            Recipe Details
                        </h2>
                        <p className="text-surface-600 dark:text-surface-400">
                            Tell us about your delicious recipe
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Recipe Title */}
                <FormField
                    label="Recipe Title"
                    required
                    {...(errors.title && { error: errors.title })}
                >
                    <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => onUpdateField('title', e.target.value)}
                        placeholder="Enter a descriptive title for your recipe"
                        className="text-lg font-medium"
                        required
                    />
                </FormField>

                {/* Time and Servings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Cook Time"
                        required
                        {...(errors.cook_time && { error: 'Cook time must be at least 1 minute' })}
                    >
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 dark:text-surface-400">
                                <Clock className="h-5 w-5" />
                            </div>
                            <Input
                                type="number"
                                value={formData.cook_time}
                                onChange={(e) => onUpdateField('cook_time', parseInt(e.target.value) || 0)}
                                min="1"
                                max="600"
                                placeholder="30"
                                className="pl-11"
                                required
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 dark:text-surface-400 text-sm">
                                minutes
                            </div>
                        </div>
                    </FormField>

                    <FormField
                        label="Servings"
                        required
                        {...(errors.servings && { error: 'Servings must be at least 1' })}
                    >
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 dark:text-surface-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <Input
                                type="number"
                                value={formData.servings}
                                onChange={(e) => onUpdateField('servings', parseInt(e.target.value) || 0)}
                                min="1"
                                max="50"
                                placeholder="4"
                                className="pl-11"
                                required
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 dark:text-surface-400 text-sm">
                                people
                            </div>
                        </div>
                    </FormField>
                </div>

                {/* Difficulty and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Difficulty Level">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 dark:text-surface-400">
                                <Star className="h-5 w-5" />
                            </div>
                            <Select
                                value={formData.difficulty}
                                onChange={(e) => onUpdateField('difficulty', e.target.value)}
                                className="pl-11"
                                options={[
                                    { value: '', label: 'Select difficulty' },
                                    ...RECIPE_CONFIG.DIFFICULTY_LEVELS.map(level => ({
                                        value: level,
                                        label: level
                                    }))
                                ]}
                            />
                            {formData.difficulty && (
                                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium ${getDifficultyColor(formData.difficulty)}`}>
                                    {formData.difficulty}
                                </div>
                            )}
                        </div>
                    </FormField>

                    <FormField label="Category">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 dark:text-surface-400">
                                <Tag className="h-5 w-5" />
                            </div>
                            <Input
                                type="text"
                                value={formData.category}
                                onChange={(e) => onUpdateField('category', e.target.value)}
                                placeholder="e.g., Breakfast, Dinner, Dessert"
                                className="pl-11"
                            />
                        </div>
                    </FormField>
                </div>

                {/* Tags */}
                <FormField
                    label="Tags"
                    description="Separate tags with commas to help others find your recipe"
                >
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 dark:text-surface-400">
                            <Tag className="h-5 w-5" />
                        </div>
                        <Input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => onUpdateField('tags', e.target.value)}
                            placeholder="healthy, quick, vegetarian, gluten-free"
                            className="pl-11"
                        />
                    </div>
                    {formData.tags && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {formData.tags.split(',').map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium"
                                >
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </FormField>

                {/* Quick Stats Preview */}
                <div className="glass-effect p-4 rounded-lg border border-surface-200 dark:border-surface-700">
                    <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3">
                        Recipe Preview
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                            <span className="text-surface-600 dark:text-surface-400">
                                {formData.cook_time || 0} min
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                            <span className="text-surface-600 dark:text-surface-400">
                                {formData.servings || 0} servings
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                            <span className="text-surface-600 dark:text-surface-400">
                                {formData.difficulty || 'Not set'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                            <span className="text-surface-600 dark:text-surface-400">
                                {formData.category || 'Uncategorized'}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 