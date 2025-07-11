import React from 'react';
import { Clock, Users } from 'lucide-react';
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
    return (
        <Card>
            <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Recipe Title"
                        required
                        {...(errors.title && { error: errors.title })}
                        className="md:col-span-2"
                    >
                        <Input
                            type="text"
                            value={formData.title}
                            onChange={(e) => onUpdateField('title', e.target.value)}
                            placeholder="Enter recipe title"
                            required
                        />
                    </FormField>

                    <FormField
                        label="Cook Time (minutes)"
                        required
                        {...(errors.cook_time && { error: 'Cook time must be at least 1 minute' })}
                    >
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <Input
                                type="number"
                                value={formData.cook_time}
                                onChange={(e) => onUpdateField('cook_time', parseInt(e.target.value) || 0)}
                                min="1"
                                max="600"
                                placeholder="30"
                                required
                            />
                        </div>
                    </FormField>

                    <FormField
                        label="Servings"
                        required
                        {...(errors.servings && { error: 'Servings must be at least 1' })}
                    >
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <Input
                                type="number"
                                value={formData.servings}
                                onChange={(e) => onUpdateField('servings', parseInt(e.target.value) || 0)}
                                min="1"
                                max="50"
                                placeholder="4"
                                required
                            />
                        </div>
                    </FormField>

                    <FormField label="Difficulty">
                        <Select
                            value={formData.difficulty}
                            onChange={(e) => onUpdateField('difficulty', e.target.value)}
                            options={RECIPE_CONFIG.DIFFICULTY_LEVELS.map(level => ({
                                value: level,
                                label: level
                            }))}
                        />
                    </FormField>

                    <FormField label="Category">
                        <Input
                            type="text"
                            value={formData.category}
                            onChange={(e) => onUpdateField('category', e.target.value)}
                            placeholder="e.g., Breakfast, Dinner, Dessert"
                        />
                    </FormField>

                    <FormField
                        label="Tags (comma-separated)"
                        className="md:col-span-2"
                    >
                        <Input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => onUpdateField('tags', e.target.value)}
                            placeholder="e.g., healthy, quick, vegetarian"
                        />
                    </FormField>
                </div>
            </CardContent>
        </Card>
    );
}; 