import { useState, useEffect } from 'react';
import { Recipe } from '@recipe-manager/shared';
import { useAuth } from '../useAuth';

export interface ActivityItem {
    id: string;
    type: 'create' | 'like' | 'comment' | 'rating' | 'view';
    recipeId: string;
    recipeTitle: string;
    timestamp: Date;
    userName?: string;
    userAvatar?: string;
}

export const useDashboard = () => {
    const { user } = useAuth();
    const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
    const [communityRecipes, setCommunityRecipes] = useState<Recipe[]>([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
    const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    
    // Mock data for demonstration
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock user recipes
            const mockUserRecipes: Recipe[] = [
                {
                    id: '1',
                    title: 'Homemade Pizza',
                    ingredients: JSON.stringify(['Flour', 'Water', 'Yeast', 'Salt', 'Olive Oil', 'Tomato Sauce', 'Cheese']),
                    instructions: 'Mix flour, water, yeast, and salt to make dough. Let rise for 1 hour. Roll out, add sauce and cheese, bake at 450°F for 12-15 minutes.',
                    cook_time: 15,
                    difficulty: 'Medium',
                    category: 'Italian',
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_id: user?.id || '1',
                    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: '2',
                    title: 'Chocolate Chip Cookies',
                    ingredients: JSON.stringify(['Flour', 'Butter', 'Sugar', 'Brown Sugar', 'Eggs', 'Vanilla', 'Chocolate Chips']),
                    instructions: 'Cream butter and sugars. Add eggs and vanilla. Mix in dry ingredients. Fold in chocolate chips. Bake at 375°F for 9-11 minutes.',
                    cook_time: 10,
                    difficulty: 'Easy',
                    category: 'Dessert',
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_id: user?.id || '1',
                    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: '9',
                    title: 'Blueberry Cookies',
                    ingredients: JSON.stringify(['Flour', 'Butter', 'Sugar', 'Brown Sugar', 'Eggs', 'Vanilla', 'Chocolate Chips']),
                    instructions: 'Cream butter and sugars. Add eggs and vanilla. Mix in dry ingredients. Fold in chocolate chips. Bake at 375°F for 9-11 minutes.',
                    cook_time: 10,
                    difficulty: 'Easy',
                    category: 'Dessert',
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_id: user?.id || '1',
                    image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                }
            ];
            
            // Mock community recipes
            const mockCommunityRecipes: Recipe[] = [
                {
                    id: '3',
                    title: 'Beef Stir Fry',
                    ingredients: JSON.stringify(['Beef', 'Bell Peppers', 'Onion', 'Garlic', 'Soy Sauce', 'Ginger', 'Rice']),
                    instructions: 'Slice beef and vegetables. Heat oil in wok. Stir fry beef until browned. Add vegetables and sauce. Serve over rice.',
                    cook_time: 20,
                    difficulty: 'Medium',
                    category: 'Asian',
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_id: 'other-user',
                    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: '4',
                    title: 'Avocado Toast',
                    ingredients: JSON.stringify(['Bread', 'Avocado', 'Lemon', 'Salt', 'Pepper', 'Red Pepper Flakes']),
                    instructions: 'Toast bread. Mash avocado with lemon juice, salt, and pepper. Spread on toast. Sprinkle with red pepper flakes.',
                    cook_time: 5,
                    difficulty: 'Easy',
                    category: 'Breakfast',
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_id: 'other-user',
                    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: '5',
                    title: 'Spaghetti Carbonara',
                    ingredients: JSON.stringify(['Spaghetti', 'Eggs', 'Parmesan', 'Pancetta', 'Black Pepper', 'Salt']),
                    instructions: 'Cook pasta. Fry pancetta. Beat eggs with cheese. Toss hot pasta with pancetta, then egg mixture. Season with pepper.',
                    cook_time: 15,
                    difficulty: 'Medium',
                    category: 'Italian',
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_id: 'other-user',
                    image_url: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                }
            ];
            
            // Mock recommended recipes
            const mockRecommendedRecipes: Recipe[] = [
                {
                    id: '6',
                    title: 'Mediterranean Salad',
                    ingredients: JSON.stringify(['Cucumber', 'Tomato', 'Olives', 'Feta', 'Red Onion', 'Olive Oil', 'Lemon']),
                    instructions: 'Chop vegetables. Combine in bowl. Top with feta. Dress with olive oil and lemon juice. Season with salt and pepper.',
                    cook_time: 10,
                    difficulty: 'Easy',
                    category: 'Salad',
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_id: 'other-user',
                    image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: '7',
                    title: 'Chicken Curry',
                    ingredients: JSON.stringify(['Chicken', 'Onion', 'Garlic', 'Ginger', 'Curry Powder', 'Coconut Milk', 'Rice']),
                    instructions: 'Sauté onions, garlic, and ginger. Add chicken and brown. Stir in curry powder. Add coconut milk and simmer. Serve with rice.',
                    cook_time: 25,
                    difficulty: 'Medium',
                    category: 'Indian',
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_id: 'other-user',
                    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: '8',
                    title: 'Berry Smoothie Bowl',
                    ingredients: JSON.stringify(['Frozen Berries', 'Banana', 'Greek Yogurt', 'Honey', 'Granola', 'Chia Seeds']),
                    instructions: 'Blend berries, banana, yogurt, and honey. Pour into bowl. Top with granola and chia seeds.',
                    cook_time: 5,
                    difficulty: 'Easy',
                    category: 'Breakfast',
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_id: 'other-user',
                    image_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                }
            ];
            
            // Mock activities
            const mockActivities: ActivityItem[] = [
                {
                    id: '1',
                    type: 'create',
                    recipeId: '1',
                    recipeTitle: 'Homemade Pizza',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
                },
                {
                    id: '2',
                    type: 'like',
                    recipeId: '2',
                    recipeTitle: 'Chocolate Chip Cookies',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
                    userName: 'Sarah Johnson',
                    userAvatar: 'SJ'
                },
                {
                    id: '3',
                    type: 'comment',
                    recipeId: '1',
                    recipeTitle: 'Homemade Pizza',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
                    userName: 'Mike Smith',
                    userAvatar: 'MS'
                },
                {
                    id: '4',
                    type: 'rating',
                    recipeId: '3',
                    recipeTitle: 'Beef Stir Fry',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
                    userName: 'Emma Wilson',
                    userAvatar: 'EW'
                }
            ];
            
            // Initialize with recipe 3 as favorite
            setFavorites(new Set(['3']));
            
            setUserRecipes(mockUserRecipes);
            setCommunityRecipes(mockCommunityRecipes);
            setFavoriteRecipes(mockCommunityRecipes[0] ? [mockCommunityRecipes[0]] : []);
            setRecommendedRecipes(mockRecommendedRecipes);
            setActivities(mockActivities);
            setIsLoading(false);
        };
        
        loadData();
    }, [user]);
    
    const toggleFavorite = (id: string) => {
        const newFavorites = new Set(favorites);
        
        if (newFavorites.has(id)) {
            newFavorites.delete(id);
            setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== id));
        } else {
            newFavorites.add(id);
            const recipe = [...userRecipes, ...communityRecipes].find(r => r.id === id);
            if (recipe) {
                setFavoriteRecipes(prev => [...prev, recipe]);
            }
        }
        
        setFavorites(newFavorites);
    };
    
    const isFavorite = (id: string) => favorites.has(id);
    
    return {
        userRecipes,
        communityRecipes,
        favoriteRecipes,
        recommendedRecipes,
        activities,
        isLoading,
        toggleFavorite,
        isFavorite
    };
}; 