import { useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';

export interface RecipeFilters {
  searchTerm: string;
  category: string;
  difficulty: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface RecipeFilterOptions {
  categories: Array<{ value: string; label: string }>;
  difficulties: Array<{ value: string; label: string }>;
  sortOptions: Array<{ value: string; label: string }>;
}

const defaultFilters: RecipeFilters = {
  searchTerm: '',
  category: '',
  difficulty: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const defaultOptions: RecipeFilterOptions = {
  categories: [
    { value: '', label: 'All Categories' },
    { value: 'Appetizers', label: 'Appetizers' },
    { value: 'Main Course', label: 'Main Course' },
    { value: 'Desserts', label: 'Desserts' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Snacks', label: 'Snacks' },
  ],
  difficulties: [
    { value: '', label: 'All Difficulties' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
  ],
  sortOptions: [
    { value: 'created_at', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'cook_time', label: 'Cook Time' },
    { value: 'difficulty', label: 'Difficulty' },
  ],
};

export const useRecipeFilters = (
  initialFilters: Partial<RecipeFilters> = {},
  options: Partial<RecipeFilterOptions> = {},
  debounceDelay: number = 300
) => {
  const [filters, setFilters] = useState<RecipeFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const filterOptions = {
    ...defaultOptions,
    ...options,
  };

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(filters.searchTerm, debounceDelay);

  // Update individual filter
  const updateFilter = useCallback((key: keyof RecipeFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update search term
  const updateSearchTerm = useCallback((value: string) => {
    updateFilter('searchTerm', value);
  }, [updateFilter]);

  // Update category
  const updateCategory = useCallback((value: string) => {
    updateFilter('category', value);
  }, [updateFilter]);

  // Update difficulty
  const updateDifficulty = useCallback((value: string) => {
    updateFilter('difficulty', value);
  }, [updateFilter]);

  // Update sort by
  const updateSortBy = useCallback((value: string) => {
    updateFilter('sortBy', value);
  }, [updateFilter]);

  // Update sort order
  const updateSortOrder = useCallback((value: 'asc' | 'desc') => {
    updateFilter('sortOrder', value);
  }, [updateFilter]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Reset filters to initial values
  const resetFilters = useCallback(() => {
    setFilters({
      ...defaultFilters,
      ...initialFilters,
    });
  }, [initialFilters]);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filters.searchTerm || 
    filters.category || 
    filters.difficulty
  );

  // Get query parameters for API calls
  const getQueryParams = useCallback(() => {
    const params: Record<string, string> = {};
    
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (filters.category) params.category = filters.category;
    if (filters.difficulty) params.difficulty = filters.difficulty;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    
    return params;
  }, [debouncedSearchTerm, filters]);

  return {
    filters,
    debouncedSearchTerm,
    filterOptions,
    hasActiveFilters,
    updateFilter,
    updateSearchTerm,
    updateCategory,
    updateDifficulty,
    updateSortBy,
    updateSortOrder,
    clearFilters,
    resetFilters,
    getQueryParams,
  };
}; 