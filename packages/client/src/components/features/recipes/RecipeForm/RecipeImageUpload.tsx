import React from 'react';
import { ImageIcon, X } from 'lucide-react';
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
                <h2 className="text-xl font-semibold text-gray-900">Recipe Image</h2>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {imagePreview ? (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Recipe preview"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={onRemoveImage}
                                className="absolute top-2 right-2 rounded-full p-2"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">Upload a photo of your recipe</p>
                            <label className="cursor-pointer">
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="pointer-events-none"
                                >
                                    <ImageIcon className="h-4 w-4 mr-2" />
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
                </div>
            </CardContent>
        </Card>
    );
}; 