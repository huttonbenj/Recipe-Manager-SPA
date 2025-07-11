import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

export const NavigationLogo: React.FC = () => {
    return (
        <div className="flex-shrink-0 flex items-center">
            <Link to="/dashboard" className="flex items-center">
                <ChefHat className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                    Recipe Manager
                </span>
            </Link>
        </div>
    );
}; 