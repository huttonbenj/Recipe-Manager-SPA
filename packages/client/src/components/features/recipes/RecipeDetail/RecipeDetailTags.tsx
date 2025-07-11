import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Badge } from '../../../ui';
import { Recipe } from '@recipe-manager/shared';
import { Tag, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface RecipeDetailTagsProps {
    recipe: Recipe;
}

export const RecipeDetailTags: React.FC<RecipeDetailTagsProps> = ({ recipe }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const tags = recipe.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

    const filteredTags = tags.filter(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Generate random pastel colors for tags
    const getTagColor = (tag: string) => {
        // Use the tag string to generate a consistent color
        const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 80%)`;
    };

    const getTagDarkColor = (tag: string) => {
        const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 30%)`;
    };

    return (
        <Card className="modern-card rounded-xl hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-900">
            <CardHeader className="pb-4 border-b border-surface-200/50 dark:border-surface-700/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-surface-100/80 dark:bg-surface-800/80 backdrop-blur-sm shadow-sm">
                            <Tag className="h-5 w-5 text-surface-600 dark:text-surface-400" />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                            Tags
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 px-2 py-1 rounded-full">
                            {tags.length} tags
                        </span>
                        <button
                            onClick={toggleExpand}
                            className="p-1.5 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                            aria-label={isExpanded ? "Collapse tags" : "Expand tags"}
                        >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <>
                    {tags.length > 5 && (
                        <div className="px-6 pt-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
                                <input
                                    type="text"
                                    placeholder="Search tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-100/80 dark:bg-surface-800/80 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-surface-500 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    <CardContent className={cn("pt-4", tags.length > 5 ? "pt-4" : "pt-2")}>
                        {filteredTags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {filteredTags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="group animate-fade-in-up"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <Badge
                                            variant="outline"
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:scale-105 cursor-pointer"
                                            style={{
                                                backgroundColor: `${getTagColor(tag)}20`,
                                                borderColor: getTagColor(tag),
                                                color: getTagDarkColor(tag)
                                            }}
                                        >
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getTagDarkColor(tag) }}></span>
                                            {tag}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                {tags.length === 0 ? (
                                    <div>
                                        <div className="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-3">
                                            <Tag className="h-6 w-6 text-surface-400" />
                                        </div>
                                        <p className="text-surface-600 dark:text-surface-400 text-sm">
                                            No tags available for this recipe
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-3">
                                            <Search className="h-6 w-6 text-surface-400" />
                                        </div>
                                        <p className="text-surface-600 dark:text-surface-400 text-sm">
                                            No tags match your search
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {tags.length > 0 && searchTerm && filteredTags.length < tags.length && (
                            <div className="mt-4 pt-4 border-t border-surface-200/50 dark:border-surface-700/50 flex justify-between items-center">
                                <span className="text-xs text-surface-500 dark:text-surface-400">
                                    Showing {filteredTags.length} of {tags.length} tags
                                </span>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-xs text-surface-600 dark:text-surface-400 hover:underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </CardContent>
                </>
            )}
        </Card>
    );
}; 