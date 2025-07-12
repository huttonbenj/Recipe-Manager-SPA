import React, { useState } from 'react';
import { X, Image, Upload, Camera, Sparkles } from 'lucide-react';
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
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file && file.type.startsWith('image/')) {
                // Create a synthetic event to match the expected type
                const syntheticEvent = {
                    target: { files: [file] }
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onImageChange(syntheticEvent);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    "group relative flex justify-center items-center w-full h-80 rounded-2xl transition-all duration-300 overflow-hidden",
                    "border-2 border-dashed",
                    isDragOver
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-950/20 scale-105"
                        : imagePreview
                            ? "border-transparent bg-surface-100 dark:bg-surface-800"
                            : "border-surface-300 dark:border-surface-700 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-900 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/10",
                    error && "border-error-500 bg-error-50 dark:bg-error-950/20"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {imagePreview ? (
                    <>
                        <img
                            src={imagePreview}
                            alt="Recipe preview"
                            className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onRemoveImage}
                                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                                    aria-label="Remove image"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Remove
                                </Button>
                                <label className="cursor-pointer">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                                        aria-label="Change image"
                                    >
                                        <Camera className="h-4 w-4 mr-2" />
                                        Change
                                    </Button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onImageChange}
                                        className="hidden"
                                        aria-label="Upload new recipe image"
                                    />
                                </label>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-8">
                        <div className="relative mx-auto mb-6">
                            <div className="flex justify-center items-center w-20 h-20 bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/30 dark:to-accent-900/30 rounded-2xl mx-auto shadow-lg">
                                <Upload className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div className="absolute -top-2 -right-2 p-1 bg-gradient-to-br from-accent-400 to-brand-500 rounded-full">
                                <Sparkles className="h-3 w-3 text-white" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                                {isDragOver ? 'Drop your image here!' : 'Upload Recipe Image'}
                            </p>
                            <p className="text-surface-600 dark:text-surface-400">
                                <span className="font-medium text-brand-600 dark:text-brand-400">Click to browse</span> or drag and drop
                            </p>
                            <p className="text-sm text-surface-500 dark:text-surface-500">
                                PNG, JPG, GIF up to 10MB • Recommended: 1200x800px
                            </p>
                        </div>

                        {/* Enhanced visual feedback */}
                        <div className="mt-6 flex justify-center">
                            <div className="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-full">
                                <Image className="h-4 w-4 text-surface-500" />
                                <span className="text-sm text-surface-600 dark:text-surface-400">
                                    Make it look delicious!
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {!imagePreview && (
                    <input
                        type="file"
                        id="image-upload"
                        name="image"
                        accept="image/*"
                        onChange={onImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="Upload recipe image"
                    />
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-error-50 dark:bg-error-950/20 border border-error-200 dark:border-error-800 rounded-lg">
                    <X className="h-4 w-4 text-error-500" />
                    <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
                </div>
            )}
        </div>
    );
}; 