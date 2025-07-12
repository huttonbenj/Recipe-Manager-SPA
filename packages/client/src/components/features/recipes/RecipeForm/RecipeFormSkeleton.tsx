import React from 'react';
import { Card } from '../../../ui/Card';

export const RecipeFormSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-surface-950 text-white animate-pulse">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Skeleton */}
                <div className="h-8 bg-surface-800 rounded-md w-1/3 mb-8"></div>
                <div className="space-y-8 mt-8">
                    {/* Image Upload Skeleton */}
                    <Card className="p-8 bg-surface-900 border-surface-800">
                        <div className="h-48 bg-surface-800 rounded-lg"></div>
                    </Card>

                    {/* Recipe Details Skeleton */}
                    <Card className="p-8 bg-surface-900 border-surface-800">
                        <div className="h-8 bg-surface-800 rounded-md w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            <div className="h-6 bg-surface-800 rounded-md w-full"></div>
                            <div className="h-6 bg-surface-800 rounded-md w-2/3"></div>
                            <div className="h-6 bg-surface-800 rounded-md w-1/2"></div>
                        </div>
                    </Card>

                    {/* Ingredients Skeleton */}
                    <Card className="p-8 bg-surface-900 border-surface-800">
                        <div className="h-8 bg-surface-800 rounded-md w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            <div className="h-6 bg-surface-800 rounded-md w-full"></div>
                            <div className="h-6 bg-surface-800 rounded-md w-full"></div>
                            <div className="h-6 bg-surface-800 rounded-md w-full"></div>
                        </div>
                    </Card>

                    {/* Instructions Skeleton */}
                    <Card className="p-8 bg-surface-900 border-surface-800">
                        <div className="h-8 bg-surface-800 rounded-md w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            <div className="h-24 bg-surface-800 rounded-md w-full"></div>
                        </div>
                    </Card>

                    {/* Actions Skeleton */}
                    <div className="flex justify-end gap-4">
                        <div className="h-12 w-24 bg-surface-800 rounded-md"></div>
                        <div className="h-12 w-32 bg-surface-800 rounded-md"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 