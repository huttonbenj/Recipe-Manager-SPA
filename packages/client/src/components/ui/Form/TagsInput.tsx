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
    placeholder,
    error,
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const newTags = [...tags, inputValue.trim()];
            onTagsChange(newTags);
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove);
        onTagsChange(newTags);
    };

    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium text-surface-300 mb-2">
                {label}
            </label>
            <div
                className={cn(
                    "flex flex-wrap items-center gap-2 w-full bg-surface-800 border-surface-700 text-white p-2 border rounded-md",
                    error && "border-red-500"
                )}
            >
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1 bg-brand-500/20 text-brand-300 rounded-full px-3 py-1 text-sm"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-brand-300 hover:text-white"
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
                    className="flex-grow bg-transparent focus:outline-none"
                />
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}; 