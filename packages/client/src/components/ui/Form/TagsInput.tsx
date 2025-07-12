import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { X } from 'lucide-react';

interface TagsInputProps {
    id: string;
    label: string;
    tags: string[];
    onTagsChange: (newTags: string[]) => void;
    placeholder?: string;
    error?: string;
}

export const TagsInput: React.FC<TagsInputProps> = ({
    id,
    label,
    tags,
    onTagsChange,
    error,
    placeholder = "Add tags..."
}) => {
    const [inputValue, setInputValue] = useState('');

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            onTagsChange([...tags, trimmedTag]);
        }
        setInputValue('');
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium text-surface-900 dark:text-surface-100 mb-2">
                {label}
            </label>
            <div
                className={cn(
                    "flex flex-wrap items-center gap-2 w-full bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 p-2 rounded-md transition-colors",
                    "border border-surface-300 dark:border-surface-700",
                    "focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20",
                    error && "border-error-500"
                )}
            >
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1 bg-brand-500/20 text-brand-700 dark:text-brand-300 rounded-full px-3 py-1 text-sm"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-brand-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                <input
                    id={id}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-grow bg-transparent border-0 outline-0 focus:outline-0 focus:ring-0 placeholder:text-surface-400 dark:placeholder:text-surface-500"
                    style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                />
            </div>
            {error && <p className="mt-2 text-sm text-error-500">{error}</p>}
        </div>
    );
}; 