import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useFormValidation, CommonValidationRules } from './useFormValidation';
import { recipeService } from '../../services';
import { uploadService } from '../../services/upload';
import type { RecipeCreate } from '@recipe-manager/shared';

export type RecipeFormData = {
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
    cook_time: number;
    servings: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    tags: string[];
    image?: File | null;
};

const initialFormData: RecipeFormData = {
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cook_time: 30,
    servings: 4,
    difficulty: 'Medium',
    category: '',
    tags: [],
    image: null,
};

type ValidatedFields = 'title' | 'ingredients' | 'instructions' | 'cook_time' | 'servings';

const validationRules: Record<ValidatedFields, any[]> = {
    title: [CommonValidationRules.required('Title is required')],
    ingredients: [CommonValidationRules.required('Ingredients are required')],
    instructions: [CommonValidationRules.required('Instructions are required')],
    cook_time: [CommonValidationRules.required('Cook time is required')],
    servings: [CommonValidationRules.required('Servings are required')],
};

// Transform form data to API format
const transformFormDataToAPI = (formData: RecipeFormData, imageUrl?: string): RecipeCreate => {
    // Convert relative image path to full URL if needed
    let fullImageUrl = imageUrl;
    if (imageUrl && !imageUrl.startsWith('http')) {
        // Use the API base URL (server) instead of window.location.origin (frontend)
        const apiBaseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
        fullImageUrl = `${apiBaseUrl}${imageUrl}`;
    }
    
    return {
        title: formData.title.trim(),
        ingredients: formData.ingredients.trim(), // Keep as string
        instructions: formData.instructions.trim(), // Keep as string
        cook_time: Number(formData.cook_time),
        servings: Number(formData.servings),
        difficulty: formData.difficulty,
        category: formData.category.trim() || 'Other',
        tags: formData.tags.length > 0 ? JSON.stringify(formData.tags) : JSON.stringify([]),
        image_url: fullImageUrl || undefined,
        // Remove description field as it's not supported by backend
    };
};

export const useRecipeForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = Boolean(id);

    const { errors } = useFormValidation(validationRules);

    const [formData, setFormData] = useState<RecipeFormData>(initialFormData);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const { data: recipe, isLoading } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => recipeService.getRecipe(id!),
        enabled: isEditing,
    });

    useEffect(() => {
        if (isEditing && recipe) {
            // Parse tags from JSON string if they exist
            let parsedTags: string[] = [];
            if (recipe.tags) {
                try {
                    parsedTags = JSON.parse(recipe.tags);
                } catch (e) {
                    // If not JSON, split by comma as fallback
                    parsedTags = recipe.tags.split(',').map(t => t.trim()).filter(t => t);
                }
            }

            setFormData({
                title: recipe.title,
                description: '', // Not supported by backend, keep empty
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                cook_time: recipe.cook_time || 30,
                servings: recipe.servings || 4,
                difficulty: recipe.difficulty as 'Easy' | 'Medium' | 'Hard' || 'Medium',
                category: recipe.category || '',
                tags: parsedTags,
                image: null,
            });
            if (recipe.image_url) {
                setImagePreview(recipe.image_url);
            }
        }
    }, [recipe, isEditing]);

    const updateFormData = useCallback((field: keyof RecipeFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                updateFormData('image', file);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        updateFormData('image', null);
    };

    // Upload image helper function
    const uploadImageIfNeeded = async (formData: RecipeFormData): Promise<string | undefined> => {
        if (formData.image && formData.image instanceof File) {
            setIsUploadingImage(true);
            try {
                const uploadResponse = await uploadService.uploadImage(formData.image);
                console.log('Upload response:', uploadResponse); // Debug log
                return uploadResponse.data?.url;
            } catch (error) {
                console.error('Image upload error:', error);
                throw new Error('Failed to upload image. Please try again.');
            } finally {
                setIsUploadingImage(false);
            }
        }
        return undefined;
    };
    
    const createMutation = useMutation({
        mutationFn: async (data: RecipeFormData) => {
            // Upload image first if present
            const imageUrl = await uploadImageIfNeeded(data);
            
            // Create recipe with image URL
            const apiData = transformFormDataToAPI(data, imageUrl);
            console.log('Sending to API:', apiData); // Debug log
            return recipeService.createRecipe(apiData);
        },
        onSuccess: () => {
            toast.success('Recipe created successfully!');
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            navigate('/');
        },
        onError: (error: any) => {
            console.error('Create recipe error:', error);
            
            // Handle specific error cases
            if (error?.response?.status === 429) {
                toast.error('Too many requests. Please wait a moment and try again.');
                return;
            }
            
            if (error?.response?.status === 400) {
                const errorData = error.response.data;
                if (errorData?.details && Array.isArray(errorData.details)) {
                    // Handle validation errors
                    const validationErrors = errorData.details.map((detail: any) => detail.message).join(', ');
                    toast.error(`Validation error: ${validationErrors}`);
                } else {
                    toast.error(errorData?.error || 'Invalid data provided. Please check your inputs.');
                }
                return;
            }
            
            // Default error handling
            const errorMessage = error?.response?.data?.error || error?.message || 'Failed to create recipe.';
            toast.error(errorMessage);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: RecipeFormData) => {
            // Upload image first if present
            const imageUrl = await uploadImageIfNeeded(data);
            
            // Update recipe with image URL (or keep existing image_url if no new image)
            const apiData = transformFormDataToAPI(data, imageUrl || recipe?.image_url);
            console.log('Updating with API data:', apiData); // Debug log
            return recipeService.updateRecipe(id!, apiData);
        },
        onSuccess: () => {
            toast.success('Recipe updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe', id] });
            navigate(`/recipes/${id}`);
        },
        onError: (error: any) => {
            console.error('Update recipe error:', error);
            
            // Handle specific error cases
            if (error?.response?.status === 429) {
                toast.error('Too many requests. Please wait a moment and try again.');
                return;
            }
            
            if (error?.response?.status === 400) {
                const errorData = error.response.data;
                if (errorData?.details && Array.isArray(errorData.details)) {
                    // Handle validation errors
                    const validationErrors = errorData.details.map((detail: any) => detail.message).join(', ');
                    toast.error(`Validation error: ${validationErrors}`);
                } else {
                    toast.error(errorData?.error || 'Invalid data provided. Please check your inputs.');
                }
                return;
            }
            
            // Default error handling
            const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update recipe.';
            toast.error(errorMessage);
        }
    });

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        
        // Validate required fields
        if (!formData.title.trim()) {
            toast.error('Recipe title is required.');
            return;
        }
        if (!formData.ingredients.trim()) {
            toast.error('Ingredients are required.');
            return;
        }
        if (!formData.instructions.trim()) {
            toast.error('Instructions are required.');
            return;
        }
        if (formData.cook_time <= 0) {
            toast.error('Cook time must be greater than 0.');
            return;
        }
        if (formData.servings <= 0) {
            toast.error('Servings must be greater than 0.');
            return;
        }

        if (isEditing) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleCancel = () => {
        navigate(isEditing ? `/recipes/${id}` : '/');
    };

    return {
        formData,
        errors,
        imagePreview,
        isSubmitting: createMutation.isPending || updateMutation.isPending || isUploadingImage,
        isEditing,
        isLoading,
        updateFormData,
        handleImageChange,
        removeImage,
        handleSubmit,
        handleCancel,
    };
}; 