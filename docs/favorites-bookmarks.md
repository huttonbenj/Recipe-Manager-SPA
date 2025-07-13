# Favorites and Bookmarks Functionality

This document explains how to use the favorites and bookmarks functionality in the Recipe Manager application.

## Overview

The Recipe Manager application allows users to save recipes in two different ways:

1. **Favorites**: For recipes that users love and want to access quickly
2. **Bookmarks**: For recipes that users want to save for later

Both features are only available to authenticated users.

## User Interface

### Recipe Cards

Each recipe card displays two action buttons:
- **Heart Icon**: Toggle favorite status
- **Bookmark Icon**: Toggle bookmark status

The icons will be filled when a recipe is favorited or bookmarked.

### Navigation

Users can access their saved recipes through:
- The main navigation menu (when authenticated)
- The user dropdown menu in the header

### Theme Support

The favorites and bookmarks UI elements fully support the application's theme system:

- **Light/Dark Mode**: All components adapt to the current display mode
- **Color Themes**: Icons and UI elements use the appropriate theme colors
- **Favorites Icon**: Uses accent color (red in default theme)
- **Bookmarks Icon**: Uses primary color (blue in default theme)
- **Accessibility**: All interactive elements maintain proper contrast in all themes

### Dedicated Pages

#### Favorites Page

- URL: `/favorites`
- Displays all recipes that the user has favorited
- Allows toggling between grid and list views
- Shows a count of favorited recipes
- Fully responsive with theme support

#### Bookmarks Page

- URL: `/bookmarks`
- Displays all recipes that the user has bookmarked
- Allows toggling between grid and list views
- Shows a count of bookmarked recipes
- Fully responsive with theme support

## API Endpoints

### Favorites

- `POST /api/user/favorites/:recipeId`: Add a recipe to favorites
- `DELETE /api/user/favorites/:recipeId`: Remove a recipe from favorites
- `GET /api/user/favorites`: Get all favorited recipes
- `GET /api/user/favorites/:recipeId/status`: Check if a recipe is favorited

### Bookmarks

- `POST /api/user/bookmarks/:recipeId`: Add a recipe to bookmarks
- `DELETE /api/user/bookmarks/:recipeId`: Remove a recipe from bookmarks
- `GET /api/user/bookmarks`: Get all bookmarked recipes
- `GET /api/user/bookmarks/:recipeId/status`: Check if a recipe is bookmarked

## Frontend Implementation

### useFavorites Hook

The `useFavorites` hook provides all the functionality needed to interact with favorites and bookmarks:

```typescript
const {
  // Data
  favorites,
  bookmarks,
  
  // Loading states
  favoritesLoading,
  bookmarksLoading,
  
  // Error states
  favoritesError,
  bookmarksError,
  
  // Mutation loading states
  isAddingToFavorites,
  isRemovingFromFavorites,
  isAddingToBookmarks,
  isRemovingFromBookmarks,
  
  // Actions
  toggleFavorite,
  toggleBookmark,
  
  // Helper functions
  isFavorited,
  isBookmarked
} = useFavorites()
```

### Usage Examples

#### Toggle Favorite Status

```typescript
// Toggle favorite status
const handleFavoriteClick = () => {
  toggleFavorite(recipe.id, isFavorited(recipe.id))
}
```

#### Toggle Bookmark Status

```typescript
// Toggle bookmark status
const handleBookmarkClick = () => {
  toggleBookmark(recipe.id, isBookmarked(recipe.id))
}
```

#### Check Status

```typescript
// Check if recipe is favorited
const favorited = isFavorited(recipe.id)

// Check if recipe is bookmarked
const bookmarked = isBookmarked(recipe.id)
```

#### Theme-Aware Styling

```tsx
// Example of theme-aware styling for favorite icon
<Heart
  className={`h-4 w-4 ${
    isFavorited(recipe.id) 
      ? 'text-accent-500 dark:text-accent-400 fill-current' 
      : 'text-secondary-600 dark:text-secondary-400'
  }`}
/>

// Example of theme-aware styling for bookmark icon
<BookmarkPlus
  className={`h-4 w-4 ${
    isBookmarked(recipe.id) 
      ? 'text-primary-500 dark:text-primary-400 fill-current' 
      : 'text-secondary-600 dark:text-secondary-400'
  }`}
/>
```

## Database Schema

The favorites and bookmarks functionality is implemented using two tables:

### user_favorites

- `id`: Unique identifier
- `userId`: Reference to the user
- `recipeId`: Reference to the recipe
- `createdAt`: Timestamp when the favorite was created

### user_bookmarks

- `id`: Unique identifier
- `userId`: Reference to the user
- `recipeId`: Reference to the recipe
- `createdAt`: Timestamp when the bookmark was created

Both tables have a unique constraint on the combination of `userId` and `recipeId` to prevent duplicates.

## Testing

The favorites and bookmarks functionality can be tested using the provided test file:

```
apps/frontend/src/__tests__/hooks/useFavorites.test.tsx
```

Run the tests with:

```bash
cd apps/frontend
npm test -- -t "useFavorites"
``` 