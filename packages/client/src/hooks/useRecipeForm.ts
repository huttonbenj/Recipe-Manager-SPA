import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RecipeFormData } from '@recipe-manager/shared';
import { apiClient } from '../services/api';
import { useFormValidation, CommonValidationRules } from './useFormValidation';
import toast from 'react-hot-toast';

const initialFormData: RecipeFormData = {
  title: '',
  ingredients: '',
  instructions: '',
  cook_time: 30,
  servings: 4,
  difficulty: 'Medium',
  category: '',
  tags: '',
};

type ValidatedFields = 'title' | 'ingredients' | 'instructions' | 'cook_time' | 'servings';

const validationRules: Record<ValidatedFields, any[]> = {
  title: [CommonValidationRules.required('Title is required')],
  ingredients: [CommonValidationRules.required('Ingredients are required')],
  instructions: [CommonValidationRules.required('Instructions are required')],
  cook_time: [CommonValidationRules.required('Cook time is required')],
  servings: [CommonValidationRules.required('Servings is required')],
};

export const useRecipeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const { errors, validateForm } = useFormValidation(validationRules);

  const [formData, setFormData] = useState<RecipeFormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch recipe data if editing
  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => apiClient.getRecipe(id!),
    enabled: isEditing,
  });

  // Load existing recipe data
  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cook_time: recipe.cook_time || 30,
        servings: recipe.servings || 4,
        difficulty: recipe.difficulty || 'Medium',
        category: recipe.category || '',
        tags: recipe.tags || '',
      });
      if (recipe.image_url) {
        setImagePreview(recipe.image_url);
      }
    }
  }, [recipe]);

  // Create recipe mutation
  const createMutation = useMutation({
    mutationFn: async (data: RecipeFormData) => {
      return apiClient.createRecipe(data);
    },
    onSuccess: () => {
      toast.success('Recipe created successfully!');
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      navigate('/recipes');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create recipe');
    },
  });

  // Update recipe mutation
  const updateMutation = useMutation({
    mutationFn: async (data: RecipeFormData) => {
      return apiClient.updateRecipe(id!, data);
    },
    onSuccess: () => {
      toast.success('Recipe updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', id] });
      navigate('/recipes');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update recipe');
    },
  });

  const updateFormData = (field: keyof RecipeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!validateForm(formData)) {
      return;
    }

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    navigate('/recipes');
  };

  return {
    formData,
    errors,
    imagePreview,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isEditing,
    isLoading,
    updateFormData,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleCancel,
  };
}; 