import React from 'react';
import { X, Image } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { cn } from '../../../../utils/cn';

interface RecipeImageUploadProps {
    imagePreview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
    error?: string;
}

export const RecipeImageUpload: React.FC<RecipeImageUploadProps> = ({
    imagePreview,
    onImageChange,
    onRemoveImage,
    error,
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-surface-900 dark:text-surface-100 mb-2">
                Recipe Image
            </label>
            <div
                className={cn(
                    "group relative flex justify-center items-center w-full h-64 bg-surface-50 dark:bg-surface-800 border-2 border-dashed rounded-lg transition-colors",
                    "border-surface-300 dark:border-surface-700 hover:border-brand-500",
                    error && "border-error-500"
                )}
            >
                {imagePreview ? (
                    <>
                        <img
                            src={imagePreview}
                            alt="Recipe preview"
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={onRemoveImage}
                                aria-label="Remove image"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Remove
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="flex justify-center items-center w-12 h-12 bg-surface-100 dark:bg-surface-700 rounded-full mx-auto mb-4">
                            <Image className="h-6 w-6 text-surface-500 dark:text-surface-400" />
                        </div>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                            <span className="font-semibold text-brand-600 dark:text-brand-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-500">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                    </div>
                )}
                <input
                    type="file"
                    id="image-upload"
                    name="image"
                    accept="image/*"
                    onChange={onImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Upload recipe image"
                />
            </div>
            {error && <p className="mt-2 text-sm text-error-500">{error}</p>}
        </div>
    );
}; 