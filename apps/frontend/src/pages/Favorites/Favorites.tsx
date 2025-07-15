/**
 * Favorites page component
 * Displays user's favorite recipes
 */
import React from 'react';
import { Heart } from 'lucide-react';

import CollectionPage from '@/components/layout/CollectionPage/CollectionPage';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import type { Recipe } from '@/types/recipe';

const Favorites: React.FC = () => {
    const { user } = useAuth();
    const { favorites, favoritesLoading, favoritesError } = useFavorites();

    const favoriteRecipes: Recipe[] = favorites.map(fav => fav.recipe);

    return (
        <CollectionPage
            pageTitle="My Favorites"
            pageIcon={<Heart className="w-8 h-8 text-accent-500" />}
            recipes={favoriteRecipes}
            isLoading={favoritesLoading}
            error={favoritesError}
            emptyState={{
                icon: <Heart className="w-16 h-16 text-secondary-400" />,
                title: 'No favorites yet',
                message: 'Start exploring recipes and click the heart icon to add them to your favorites.',
            }}
            currentUserId={user?.id}
        />
    );
};

export default Favorites; 