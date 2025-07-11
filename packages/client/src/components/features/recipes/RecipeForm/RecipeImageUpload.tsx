import React from 'react';
import { ImageIcon, X, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../ui/Card';
import { Button } from '../../../ui/Button';

interface RecipeImageUploadProps {
    imagePreview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

export const RecipeImageUpload: React.FC<RecipeImageUploadProps> = ({
    imagePreview,
    onImageChange,
    onRemoveImage,
}) => {
    return (
        <Card>
            <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recipe Image</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Upload a photo of your recipe to make it more appealing</p>
            </CardHeader>
            <CardContent>
                {imagePreview ? (
                    <div className="relative rounded-lg overflow-hidden">
                        <img
                            src={imagePreview}
                            alt="Recipe preview"
                            className="w-full h-80 object-cover transition-all hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-4 right-4 flex space-x-2">
                                <label className="cursor-pointer">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="bg-white/80 backdrop-blur-sm hover:bg-white"
                                    >
                                        <Upload className="h-4 w-4 mr-1" />
                                        Change
                                    </Button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onImageChange}
                                        className="hidden"
                                    />
                                </label>
                                <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    onClick={onRemoveImage}
                                    className="bg-white/80 backdrop-blur-sm hover:bg-white text-red-500"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center transition-colors hover:border-brand-500 dark:hover:border-brand-400">
                        <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Upload a photo</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Drag and drop an image, or click to browse your files.
                            High-quality images make recipes more appealing.
                        </p>
                        <label className="cursor-pointer inline-block">
                            <Button
                                type="button"
                                variant="primary"
                                size="lg"
                                className="pointer-events-none"
                            >
                                <ImageIcon className="h-5 w-5 mr-2" />
                                Choose Image
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 