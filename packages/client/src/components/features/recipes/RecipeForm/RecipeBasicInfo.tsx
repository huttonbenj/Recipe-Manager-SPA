import React from 'react';
import { Input } from '../../../ui/Form/Input';
import { Textarea } from '../../../ui/Form/Textarea';
import { Select } from '../../../ui/Form/Select';
import { TagsInput } from '../../../ui/Form/TagsInput';
import { RecipeFormData } from '../../../../hooks/form/useRecipeForm';

interface RecipeBasicInfoProps {
    formData: RecipeFormData;
    errors: any;
    onUpdateField: (field: keyof RecipeFormData, value: any) => void;
}

export const RecipeBasicInfo: React.FC<RecipeBasicInfoProps> = ({ formData, errors, onUpdateField }) => {
    return (
        <div className="space-y-6">
            <Input
                id="title"
                label="Recipe Title"
                placeholder="e.g., Classic Lasagna"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateField('title', e.target.value)}
                error={errors.title}
                required
            />
            <Textarea
                id="description"
                label="Description"
                placeholder="A brief description of your recipe..."
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdateField('description', e.target.value)}
                error={errors.description}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    id="cook_time"
                    label="Cook Time (minutes)"
                    type="number"
                    placeholder="e.g., 60"
                    value={String(formData.cook_time)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateField('cook_time', parseInt(e.target.value))}
                    error={errors.cook_time}
                />
                <Input
                    id="servings"
                    label="Servings"
                    type="number"
                    placeholder="e.g., 4"
                    value={String(formData.servings)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateField('servings', parseInt(e.target.value))}
                    error={errors.servings}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-surface-200 mb-2">
                        Category
                    </label>
                    <Select
                        id="category"
                        value={formData.category}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdateField('category', e.target.value)}
                        error={errors.category}
                        options={[
                            { value: "", label: "Select a category" },
                            { value: "Appetizer", label: "Appetizer" },
                            { value: "Main Course", label: "Main Course" },
                            { value: "Dessert", label: "Dessert" },
                            { value: "Salad", label: "Salad" },
                            { value: "Soup", label: "Soup" }
                        ]}
                    />
                </div>
                <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-surface-200 mb-2">
                        Difficulty
                    </label>
                    <Select
                        id="difficulty"
                        value={formData.difficulty}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdateField('difficulty', e.target.value as 'Easy' | 'Medium' | 'Hard')}
                        error={errors.difficulty}
                        options={[
                            { value: "", label: "Select difficulty" },
                            { value: "Easy", label: "Easy" },
                            { value: "Medium", label: "Medium" },
                            { value: "Hard", label: "Hard" }
                        ]}
                    />
                </div>
            </div>
            <TagsInput
                id="tags"
                label="Tags"
                tags={formData.tags}
                onTagsChange={(newTags) => onUpdateField('tags', newTags)}
                placeholder="Add a tag and press Enter"
                error={errors.tags}
            />
        </div>
    );
}; 