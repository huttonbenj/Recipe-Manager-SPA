/**
 * Bookmarks page component
 * Displays user's bookmarked recipes
 */
import React from 'react';
import { Bookmark } from 'lucide-react';

import CollectionPage from '@/components/layout/CollectionPage/CollectionPage';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import type { Recipe } from '@/types/recipe';

const Bookmarks: React.FC = () => {
    const { user } = useAuth();
    const { bookmarks, bookmarksLoading, bookmarksError } = useFavorites();

    const bookmarkedRecipes: Recipe[] = bookmarks.map(bookmark => bookmark.recipe);

    return (
        <CollectionPage
            pageTitle="My Bookmarks"
            pageIcon={<Bookmark className="w-8 h-8 text-primary-500" />}
            recipes={bookmarkedRecipes}
            isLoading={bookmarksLoading}
            error={bookmarksError}
            emptyState={{
                icon: <Bookmark className="w-16 h-16 text-secondary-400" />,
                title: 'No bookmarks yet',
                message: 'Start exploring recipes and click the bookmark icon to save them for later.',
            }}
            currentUserId={user?.id}
        />
    );
};

export default Bookmarks; 