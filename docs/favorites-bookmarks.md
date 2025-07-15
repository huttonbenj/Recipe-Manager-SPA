# Favorites & Bookmarks Feature Documentation

## Overview

The Recipe Manager SPA includes a comprehensive favorites and bookmarks system that allows users to save and organize recipes they love. This feature enhances user experience by providing personal recipe collections and easy access to preferred content.

## Feature Distinction

### Favorites ⭐

- **Purpose**: Mark recipes you love and want to cook again
- **Typical Use**: "This recipe was amazing, I want to make it again"
- **UI Indicator**: Star icon (filled when favorited)
- **Collection**: "My Favorites" page
- **Behavior**: Toggle on/off with visual feedback

### Bookmarks 🔖

- **Purpose**: Save recipes to try later or reference
- **Typical Use**: "This looks interesting, I'll try it sometime"
- **UI Indicator**: Bookmark icon (filled when bookmarked)
- **Collection**: "My Bookmarks" page
- **Behavior**: Toggle on/off with visual feedback

## User Interface

### Recipe Cards

Each recipe card displays both favorite and bookmark controls:

```tsx
// Recipe card controls
<div className="flex gap-2">
  <FavoriteButton 
    recipeId={recipe.id}
    isFavorited={favorites.includes(recipe.id)}
    onToggle={handleFavoriteToggle}
  />
  <BookmarkButton 
    recipeId={recipe.id}
    isBookmarked={bookmarks.includes(recipe.id)}
    onToggle={handleBookmarkToggle}
  />
</div>
```

### Navigation

Users can access their collections via:

- **Header Navigation**: Quick links to Favorites and Bookmarks
- **Profile Menu**: Access to personal collections
- **Dashboard**: Overview of saved recipes

### Collection Pages

#### Favorites Page (`/app/favorites`)

- Displays all favorited recipes
- Same layout as main recipes page
- Search and filter within favorites
- Pagination support
- Quick access to unfavorite recipes

#### Bookmarks Page (`/app/bookmarks`)

- Displays all bookmarked recipes
- Same layout as main recipes page
- Search and filter within bookmarks
- Pagination support
- Quick access to unbookmark recipes

## API Implementation

### Database Schema

```sql
-- Favorites table
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Favorite_userId_recipeId_key" UNIQUE("userId", "recipeId")
);

-- Bookmarks table
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Bookmark_userId_recipeId_key" UNIQUE("userId", "recipeId")
);

-- Foreign key constraints
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_recipeId_fkey" 
    FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_recipeId_fkey" 
    FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### API Endpoints

#### Favorites Endpoints

```http
# Get user's favorites
GET /api/user/favorites
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "favorite_id",
        "recipeId": "recipe_id",
        "userId": "user_id",
        "createdAt": "2025-01-15T10:30:00.000Z",
        "recipe": {
          "id": "recipe_id",
          "title": "Delicious Pasta",
          "description": "A tasty pasta dish",
          "imageUrl": "/uploads/pasta.webp",
          "author": {
            "username": "chef123"
          }
        }
      }
    ]
  },
  "message": "Favorites retrieved successfully"
}
```

```http
# Add recipe to favorites
POST /api/user/favorites/:recipeId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "favorite": {
      "id": "favorite_id",
      "recipeId": "recipe_id",
      "userId": "user_id",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  },
  "message": "Recipe added to favorites"
}
```

```http
# Remove recipe from favorites
DELETE /api/user/favorites/:recipeId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": null,
  "message": "Recipe removed from favorites"
}
```

#### Bookmarks Endpoints

```http
# Get user's bookmarks
GET /api/user/bookmarks
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "bookmarks": [
      {
        "id": "bookmark_id",
        "recipeId": "recipe_id",
        "userId": "user_id",
        "createdAt": "2025-01-15T10:30:00.000Z",
        "recipe": {
          "id": "recipe_id",
          "title": "Chocolate Cake",
          "description": "Rich chocolate cake recipe",
          "imageUrl": "/uploads/cake.webp",
          "author": {
            "username": "baker456"
          }
        }
      }
    ]
  },
  "message": "Bookmarks retrieved successfully"
}
```

```http
# Add recipe to bookmarks
POST /api/user/bookmarks/:recipeId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "bookmark": {
      "id": "bookmark_id",
      "recipeId": "recipe_id",
      "userId": "user_id",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  },
  "message": "Recipe added to bookmarks"
}
```

```http
# Remove recipe from bookmarks
DELETE /api/user/bookmarks/:recipeId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": null,
  "message": "Recipe removed from bookmarks"
}
```

## Frontend Implementation

### Custom Hooks

#### useFavorites Hook

```typescript
interface UseFavoritesReturn {
  favorites: string[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (recipeId: string) => Promise<void>;
  removeFavorite: (recipeId: string) => Promise<void>;
  toggleFavorite: (recipeId: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
}

const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Implementation includes:
  // - Fetch user favorites on mount
  // - Add/remove favorites with optimistic updates
  // - Error handling and retry logic
  // - Cache management
  
  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite: (recipeId: string) => favorites.includes(recipeId)
  };
};
```

#### useBookmarks Hook

```typescript
interface UseBookmarksReturn {
  bookmarks: string[];
  isLoading: boolean;
  error: string | null;
  addBookmark: (recipeId: string) => Promise<void>;
  removeBookmark: (recipeId: string) => Promise<void>;
  toggleBookmark: (recipeId: string) => Promise<void>;
  isBookmarked: (recipeId: string) => boolean;
}

const useBookmarks = (): UseBookmarksReturn => {
  // Similar implementation to useFavorites
  // Manages bookmark state and operations
};
```

### Components

#### FavoriteButton Component

```tsx
interface FavoriteButtonProps {
  recipeId: string;
  isFavorited: boolean;
  onToggle: (recipeId: string) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  recipeId,
  isFavorited,
  onToggle,
  size = 'md',
  showLabel = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsLoading(true);
    try {
      await onToggle(recipeId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={`transition-colors ${isFavorited ? 'text-red-500' : 'text-gray-400'}`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} 
      />
      {showLabel && (
        <span className="ml-1">
          {isFavorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </Button>
  );
};
```

#### BookmarkButton Component

```tsx
interface BookmarkButtonProps {
  recipeId: string;
  isBookmarked: boolean;
  onToggle: (recipeId: string) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  recipeId,
  isBookmarked,
  onToggle,
  size = 'md',
  showLabel = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsLoading(true);
    try {
      await onToggle(recipeId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={`transition-colors ${isBookmarked ? 'text-blue-500' : 'text-gray-400'}`}
      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark 
        className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} 
      />
      {showLabel && (
        <span className="ml-1">
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </Button>
  );
};
```

## User Experience Features

### Optimistic Updates

Both favorites and bookmarks use optimistic updates for immediate feedback:

```typescript
const toggleFavorite = async (recipeId: string) => {
  const wasFavorited = favorites.includes(recipeId);
  
  // Optimistic update
  setFavorites(prev => 
    wasFavorited 
      ? prev.filter(id => id !== recipeId)
      : [...prev, recipeId]
  );

  try {
    if (wasFavorited) {
      await favoritesApi.remove(recipeId);
    } else {
      await favoritesApi.add(recipeId);
    }
  } catch (error) {
    // Revert on error
    setFavorites(prev => 
      wasFavorited 
        ? [...prev, recipeId]
        : prev.filter(id => id !== recipeId)
    );
    throw error;
  }
};
```

### Toast Notifications

Users receive feedback for actions:

```typescript
const { addToast } = useToast();

const addFavorite = async (recipeId: string) => {
  try {
    await favoritesApi.add(recipeId);
    addToast({
      type: 'success',
      message: 'Recipe added to favorites!',
      duration: 3000
    });
  } catch (error) {
    addToast({
      type: 'error',
      message: 'Failed to add recipe to favorites',
      duration: 5000
    });
  }
};
```

### Loading States

Visual feedback during operations:

- **Button States**: Loading spinner while processing
- **Disabled State**: Prevent multiple clicks
- **Visual Feedback**: Color changes for immediate response

### Error Handling

Comprehensive error handling:

- **Network Errors**: Retry mechanism with exponential backoff
- **Authentication Errors**: Redirect to login
- **Server Errors**: User-friendly error messages
- **Optimistic Update Reversion**: Restore previous state on failure

## Performance Optimizations

### Caching Strategy

```typescript
// Client-side caching with SWR
const { data: favorites, mutate } = useSWR(
  '/api/user/favorites',
  favoritesApi.getAll,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
  }
);
```

### Batch Operations

For multiple recipe operations:

```typescript
const batchToggleFavorites = async (recipeIds: string[]) => {
  const operations = recipeIds.map(id => ({
    recipeId: id,
    action: favorites.includes(id) ? 'remove' : 'add'
  }));

  // Optimistic updates
  updateFavoritesOptimistically(operations);

  try {
    await favoritesApi.batchUpdate(operations);
  } catch (error) {
    // Revert all operations
    revertFavoritesUpdate(operations);
    throw error;
  }
};
```

### Lazy Loading

Collections are loaded efficiently:

```typescript
const useFavoritesPage = (page: number, limit: number) => {
  return useInfiniteQuery(
    ['favorites', page],
    ({ pageParam = 1 }) => favoritesApi.getPage(pageParam, limit),
    {
      getNextPageParam: (lastPage) => 
        lastPage.hasNext ? lastPage.page + 1 : undefined,
    }
  );
};
```

## Database Considerations

### Indexing

Optimized database indexes for performance:

```sql
-- Favorites indexes
CREATE INDEX idx_favorites_user_id ON "Favorite"("userId");
CREATE INDEX idx_favorites_recipe_id ON "Favorite"("recipeId");
CREATE INDEX idx_favorites_created_at ON "Favorite"("createdAt");

-- Bookmarks indexes
CREATE INDEX idx_bookmarks_user_id ON "Bookmark"("userId");
CREATE INDEX idx_bookmarks_recipe_id ON "Bookmark"("recipeId");
CREATE INDEX idx_bookmarks_created_at ON "Bookmark"("createdAt");

-- Composite indexes for common queries
CREATE INDEX idx_favorites_user_recipe ON "Favorite"("userId", "recipeId");
CREATE INDEX idx_bookmarks_user_recipe ON "Bookmark"("userId", "recipeId");
```

### Constraints

Data integrity constraints:

```sql
-- Unique constraint to prevent duplicates
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_recipeId_key" 
    UNIQUE("userId", "recipeId");

ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_recipeId_key" 
    UNIQUE("userId", "recipeId");

-- Cascade deletion
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
```

## Testing

### Backend Tests

```typescript
describe('Favorites API', () => {
  test('should add recipe to favorites', async () => {
    const response = await request(app)
      .post(`/api/user/favorites/${recipeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.favorite.recipeId).toBe(recipeId);
  });

  test('should prevent duplicate favorites', async () => {
    // Add favorite
    await request(app)
      .post(`/api/user/favorites/${recipeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    // Try to add again
    await request(app)
      .post(`/api/user/favorites/${recipeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  test('should remove recipe from favorites', async () => {
    // Add favorite first
    await request(app)
      .post(`/api/user/favorites/${recipeId}`)
      .set('Authorization', `Bearer ${token}`);

    // Remove favorite
    await request(app)
      .delete(`/api/user/favorites/${recipeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
```

### Frontend Tests

```typescript
describe('useFavorites Hook', () => {
  test('should toggle favorite status', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    // Add favorite
    await act(async () => {
      await result.current.addFavorite('recipe-1');
    });

    expect(result.current.isFavorite('recipe-1')).toBe(true);

    // Remove favorite
    await act(async () => {
      await result.current.removeFavorite('recipe-1');
    });

    expect(result.current.isFavorite('recipe-1')).toBe(false);
  });

  test('should handle errors gracefully', async () => {
    // Mock API error
    favoritesApi.add.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await act(async () => {
      try {
        await result.current.addFavorite('recipe-1');
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    expect(result.current.isFavorite('recipe-1')).toBe(false);
  });
});
```

## Analytics and Insights

### Tracking Metrics

Track user engagement:

```typescript
// Analytics events
analytics.track('recipe_favorited', {
  recipeId,
  userId,
  recipeTitle,
  cuisine,
  difficulty
});

analytics.track('recipe_bookmarked', {
  recipeId,
  userId,
  recipeTitle,
  source: 'recipe_detail' // or 'recipe_card'
});
```

### Popular Recipes

Identify trending recipes:

```sql
-- Most favorited recipes
SELECT r.id, r.title, COUNT(f.id) as favorite_count
FROM "Recipe" r
LEFT JOIN "Favorite" f ON r.id = f."recipeId"
WHERE r."createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY r.id, r.title
ORDER BY favorite_count DESC
LIMIT 10;

-- Most bookmarked recipes
SELECT r.id, r.title, COUNT(b.id) as bookmark_count
FROM "Recipe" r
LEFT JOIN "Bookmark" b ON r.id = b."recipeId"
WHERE r."createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY r.id, r.title
ORDER BY bookmark_count DESC
LIMIT 10;
```

## Future Enhancements

### Planned Features

1. **Recipe Collections**: Organize favorites/bookmarks into custom collections
2. **Sharing**: Share favorite collections with other users
3. **Smart Recommendations**: Suggest recipes based on favorites
4. **Export**: Export favorites/bookmarks to PDF or other formats
5. **Meal Planning**: Convert bookmarks to meal plans
6. **Shopping Lists**: Generate shopping lists from favorite recipes

### Implementation Considerations

- **Scalability**: Design for millions of favorites/bookmarks
- **Real-time Updates**: WebSocket notifications for shared collections
- **Offline Support**: Cache favorites for offline access
- **Data Export**: GDPR compliance for user data export

## Troubleshooting

### Common Issues

**1. Favorites Not Syncing:**

```bash
# Check API endpoints
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/user/favorites

# Check database
SELECT COUNT(*) FROM "Favorite" WHERE "userId" = 'user_id';
```

**2. Duplicate Entries:**

```sql
-- Find duplicates
SELECT "userId", "recipeId", COUNT(*)
FROM "Favorite"
GROUP BY "userId", "recipeId"
HAVING COUNT(*) > 1;
```

**3. Performance Issues:**

```sql
-- Check missing indexes
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM "Favorite" WHERE "userId" = 'user_id';
```

## Best Practices

### Development

1. **Optimistic Updates**: Always update UI immediately
2. **Error Handling**: Graceful error recovery
3. **Loading States**: Clear visual feedback
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Testing**: Comprehensive unit and integration tests

### Performance

1. **Batch Operations**: Group multiple operations
2. **Caching**: Client-side and server-side caching
3. **Indexing**: Proper database indexes
4. **Lazy Loading**: Load data as needed
5. **Debouncing**: Prevent rapid-fire requests

### Security

1. **Authentication**: Always verify user ownership
2. **Rate Limiting**: Prevent abuse
3. **Input Validation**: Sanitize all inputs
4. **CORS**: Proper cross-origin settings
5. **SQL Injection**: Use parameterized queries

## Related Documentation

- [API Documentation](./api-documentation.md) - Complete API reference
- [Development Setup](./development-setup.md) - Local development guide
- [Deployment Guide](./deployment-guide.md) - Production deployment
