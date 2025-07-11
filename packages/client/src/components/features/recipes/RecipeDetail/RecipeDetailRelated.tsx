import React from 'react';
import { ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../ui';

export const RecipeDetailRelated: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">You might also like</h3>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Placeholder for related recipes */}
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <ChefHat className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">More recipes coming soon!</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 