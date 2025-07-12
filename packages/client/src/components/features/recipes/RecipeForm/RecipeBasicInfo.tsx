import React from 'react';
import { Clock, Users, Star, Tag, BookOpen, FileText } from 'lucide-react';
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
        <div className="space-y-8">
            {/* Recipe Title */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-accent-500/5 rounded-xl blur-sm"></div>
                <div className="relative p-6 bg-surface-50/50 dark:bg-surface-800/50 rounded-xl border border-surface-200/50 dark:border-surface-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 shadow-md">
                            <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                            Recipe Title
                        </h3>
                    </div>
                    <Input
                        id="title"
                        label=""
                        placeholder="e.g., Grandma's Famous Chocolate Chip Cookies"
                        value={formData.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateField('title', e.target.value)}
                        error={errors.title}
                        required
                        className="text-lg font-medium"
                    />
                </div>
            </div>

            {/* Description */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500/5 to-brand-500/5 rounded-xl blur-sm"></div>
                <div className="relative p-6 bg-surface-50/50 dark:bg-surface-800/50 rounded-xl border border-surface-200/50 dark:border-surface-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 shadow-md">
                            <FileText className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                            Description
                        </h3>
                    </div>
                    <Textarea
                        id="description"
                        label=""
                        placeholder="A brief description of your recipe... What makes it special?"
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdateField('description', e.target.value)}
                        error={errors.description}
                        rows={3}
                    />
                </div>
            </div>

            {/* Time & Servings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-success-500/5 to-emerald-500/5 rounded-xl blur-sm"></div>
                    <div className="relative p-6 bg-surface-50/50 dark:bg-surface-800/50 rounded-xl border border-surface-200/50 dark:border-surface-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-success-500 to-emerald-600 shadow-md">
                                <Clock className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                                Cook Time
                            </h3>
                        </div>
                        <Input
                            id="cook_time"
                            label=""
                            type="number"
                            placeholder="e.g., 45"
                            value={String(formData.cook_time)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateField('cook_time', parseInt(e.target.value))}
                            error={errors.cook_time}
                            className="text-center font-medium"
                        />
                        <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 text-center">
                            minutes
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-warning-500/5 to-amber-500/5 rounded-xl blur-sm"></div>
                    <div className="relative p-6 bg-surface-50/50 dark:bg-surface-800/50 rounded-xl border border-surface-200/50 dark:border-surface-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-warning-500 to-amber-600 shadow-md">
                                <Users className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                                Servings
                            </h3>
                        </div>
                        <Input
                            id="servings"
                            label=""
                            type="number"
                            placeholder="e.g., 4"
                            value={String(formData.servings)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateField('servings', parseInt(e.target.value))}
                            error={errors.servings}
                            className="text-center font-medium"
                        />
                        <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 text-center">
                            people
                        </p>
                    </div>
                </div>
            </div>

            {/* Category & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-xl blur-sm"></div>
                    <div className="relative p-6 bg-surface-50/50 dark:bg-surface-800/50 rounded-xl border border-surface-200/50 dark:border-surface-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 shadow-md">
                                <Tag className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                                Category
                            </h3>
                        </div>
                        <Select
                            id="category"
                            value={formData.category}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdateField('category', e.target.value)}
                            error={errors.category}
                            options={[
                                { value: "", label: "Select a category" },
                                { value: "Appetizer", label: "🥗 Appetizer" },
                                { value: "Main Course", label: "🍽️ Main Course" },
                                { value: "Dessert", label: "🍰 Dessert" },
                                { value: "Salad", label: "🥙 Salad" },
                                { value: "Soup", label: "🍲 Soup" },
                                { value: "Beverage", label: "🥤 Beverage" },
                                { value: "Snack", label: "🍿 Snack" }
                            ]}
                        />
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-error-500/5 to-red-500/5 rounded-xl blur-sm"></div>
                    <div className="relative p-6 bg-surface-50/50 dark:bg-surface-800/50 rounded-xl border border-surface-200/50 dark:border-surface-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-error-500 to-red-600 shadow-md">
                                <Star className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                                Difficulty
                            </h3>
                        </div>
                        <Select
                            id="difficulty"
                            value={formData.difficulty}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdateField('difficulty', e.target.value as 'Easy' | 'Medium' | 'Hard')}
                            error={errors.difficulty}
                            options={[
                                { value: "", label: "Select difficulty" },
                                { value: "Easy", label: "🟢 Easy" },
                                { value: "Medium", label: "🟡 Medium" },
                                { value: "Hard", label: "🔴 Hard" }
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 rounded-xl blur-sm"></div>
                <div className="relative p-6 bg-surface-50/50 dark:bg-surface-800/50 rounded-xl border border-surface-200/50 dark:border-surface-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md">
                            <Tag className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                                Tags
                            </h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                                Add tags to help others find your recipe
                            </p>
                        </div>
                    </div>
                    <TagsInput
                        id="tags"
                        label=""
                        tags={formData.tags}
                        onTagsChange={(newTags) => onUpdateField('tags', newTags)}
                        placeholder="e.g., vegetarian, quick, comfort-food"
                        error={errors.tags}
                    />
                </div>
            </div>
        </div>
    );
}; 