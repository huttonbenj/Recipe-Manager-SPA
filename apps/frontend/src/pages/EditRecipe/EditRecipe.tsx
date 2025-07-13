/**
 * Edit recipe page component
 * Comprehensive form for editing existing recipes with validation and image upload
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, X, Plus, Minus, Clock, Users, ChefHat,
  Save, Eye, Camera, AlertCircle
} from 'lucide-react'

// UI Components
import {
  Card, CardHeader, CardBody,
  Button, Input, Textarea, Select, Badge, Loading
} from '@/components/ui'

// Services and hooks
import { recipesApi } from '@/services/api/recipes'
import { uploadApi } from '@/services/api/upload'
import { useAuth } from '@/hooks/useAuth'

// Types
import { Difficulty } from '@/types'

/**
 * Recipe form data interface
 */
interface RecipeFormData {
  title: string
  description: string
  ingredients: string[]
  instructions: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: Difficulty
  cuisine?: string
  tags: string[]
  imageUrl?: string
}

/**
 * Form validation errors
 */
interface FormErrors {
  title?: string
  description?: string
  ingredients?: string
  instructions?: string
  prepTime?: string
  cookTime?: string
  servings?: string
  submit?: string
}

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Form state
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    ingredients: [''],
    instructions: '',
    tags: [],
    difficulty: Difficulty.MEDIUM,
    cuisine: ''
  })

  // UI state
  const [errors, setErrors] = useState<FormErrors>({})
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [newTag, setNewTag] = useState('')
  const [isFormDirty, setIsFormDirty] = useState(false)

  // Fetch existing recipe data
  const { data: recipe, isLoading: isLoadingRecipe, error: recipeError } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipesApi.getRecipe(id!),
    enabled: !!id,
  })

  // Update recipe mutation
  const updateMutation = useMutation({
    mutationFn: (data: RecipeFormData) => recipesApi.updateRecipe(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe', id] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      navigate(`/recipes/${id}`)
    },
    onError: (error: any) => {
      setErrors({
        submit: error?.response?.data?.message || 'Failed to update recipe. Please try again.'
      })
    }
  })

  // Populate form with existing recipe data
  useEffect(() => {
    if (recipe) {
      // Check if user owns this recipe
      if (recipe.authorId !== user?.id) {
        navigate(`/recipes/${id}`)
        return
      }

      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients?.length ? recipe.ingredients : [''],
        instructions: recipe.instructions || '',
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        cuisine: recipe.cuisine || '',
        tags: recipe.tags || [],
        imageUrl: recipe.imageUrl
      })

      if (recipe.imageUrl) {
        setPreviewImage(recipe.imageUrl)
      }
    }
  }, [recipe, user, id, navigate])

  /**
   * Validate form data
   */
  const validateForm = (): FormErrors => {
    const errors: FormErrors = {}

    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Recipe title is required'
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters'
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = 'Recipe description is required'
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters'
    }

    // Ingredients validation
    const validIngredients = formData.ingredients.filter(ing => ing.trim())
    if (validIngredients.length === 0) {
      errors.ingredients = 'At least one ingredient is required'
    } else if (validIngredients.length < 2) {
      errors.ingredients = 'At least two ingredients are required'
    }

    // Instructions validation
    if (!formData.instructions.trim()) {
      errors.instructions = 'Cooking instructions are required'
    } else if (formData.instructions.length < 20) {
      errors.instructions = 'Instructions must be at least 20 characters'
    }

    // Time validations
    if (formData.prepTime && (formData.prepTime < 1 || formData.prepTime > 1440)) {
      errors.prepTime = 'Prep time must be between 1 and 1440 minutes'
    }

    if (formData.cookTime && (formData.cookTime < 1 || formData.cookTime > 1440)) {
      errors.cookTime = 'Cook time must be between 1 and 1440 minutes'
    }

    // Servings validation
    if (formData.servings && (formData.servings < 1 || formData.servings > 50)) {
      errors.servings = 'Servings must be between 1 and 50'
    }

    return errors
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setErrors({})

    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    // Clean up ingredients
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(ing => ing.trim()),
    }

    updateMutation.mutate(cleanedData)
  }

  /**
   * Handle image upload
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setErrors({ submit: 'Please select an image file' })
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors({ submit: 'Image must be smaller than 5MB' })
      return
    }

    setIsUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload image
      const response = await uploadApi.uploadImage(file)
      setFormData(prev => ({ ...prev, imageUrl: response.url }))
      setIsFormDirty(true)
    } catch (error) {
      setErrors({ submit: 'Failed to upload image. Please try again.' })
      setPreviewImage(formData.imageUrl || '')
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Remove uploaded image
   */
  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: undefined }))
    setPreviewImage('')
    setIsFormDirty(true)
  }

  /**
   * Add new ingredient field
   */
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }))
    setIsFormDirty(true)
  }

  /**
   * Remove ingredient field
   */
  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
    setIsFormDirty(true)
  }

  /**
   * Update ingredient value
   */
  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }))
    setIsFormDirty(true)
  }

  /**
   * Add new tag
   */
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
      setIsFormDirty(true)
    }
  }

  /**
   * Remove tag
   */
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
    setIsFormDirty(true)
  }

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof RecipeFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || undefined : e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsFormDirty(true)

    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle navigation with unsaved changes
  const handleBackClick = () => {
    if (isFormDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(`/recipes/${id}`)
      }
    } else {
      navigate(`/recipes/${id}`)
    }
  }

  // Loading state for recipe fetch
  if (isLoadingRecipe) {
    return <Loading variant="spinner" size="lg" text="Loading recipe..." fullScreen />
  }

  // Error state for recipe fetch
  if (recipeError || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-accent-500 dark:text-accent-400 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Recipe Not Found</h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            The recipe you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <Button onClick={() => navigate('/recipes')}>
            Browse Recipes
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Edit Recipe</h1>
            {isFormDirty && (
              <Badge variant="secondary" className="text-orange-600">
                Unsaved changes
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/recipes/${id}`)}
              leftIcon={<Eye className="w-4 h-4 mr-2" />}
            >
              View Recipe
            </Button>
            <Button
              type="submit"
              form="recipe-form"
              disabled={updateMutation.isPending || !isFormDirty}
              leftIcon={<Save className="w-4 h-4 mr-2" />}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <form id="recipe-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Submit Error Display */}
          {errors.submit && (
            <div className="toast-error border rounded-md p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 toast-icon-error" />
              <p className="form-error">{errors.submit}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Basic Information</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Recipe Title"
                    placeholder="Enter a delicious recipe name"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    error={errors.title}
                    required
                  />

                  <Textarea
                    label="Description"
                    placeholder="Describe your recipe and what makes it special"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    error={!!errors.description}
                    helperText={errors.description}
                    rows={3}
                    required
                  />
                </CardBody>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Recipe Image</h2>
                </CardHeader>
                <CardBody>
                  {previewImage || formData.imageUrl ? (
                    <div className="relative">
                      <img
                        src={previewImage || formData.imageUrl}
                        alt="Recipe preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                        leftIcon={<X className="w-4 h-4" />}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        {isUploading ? (
                          <Loading variant="spinner" size="md" />
                        ) : (
                          <>
                            <Camera className="w-12 h-12 text-secondary-400 dark:text-secondary-500" />
                            <span className="text-secondary-600 dark:text-secondary-400">Click to upload recipe image</span>
                            <span className="text-sm text-secondary-500 dark:text-secondary-500">PNG, JPG up to 5MB</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Ingredients */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Ingredients</h2>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={addIngredient}
                      leftIcon={<Plus className="w-4 h-4 mr-2" />}
                    >
                      Add
                    </Button>
                  </div>
                  {errors.ingredients && (
                    <p className="text-sm text-accent-600 dark:text-accent-400">{errors.ingredients}</p>
                  )}
                </CardHeader>
                <CardBody className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Ingredient ${index + 1}`}
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="flex-1"
                      />
                      {formData.ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                          leftIcon={<Minus className="w-4 h-4" />}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </CardBody>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Cooking Instructions</h2>
                </CardHeader>
                <CardBody>
                  <Textarea
                    placeholder="Step 1: Preheat your oven to 350°F...&#10;Step 2: In a large bowl, mix..."
                    value={formData.instructions}
                    onChange={handleInputChange('instructions')}
                    error={!!errors.instructions}
                    helperText={errors.instructions || "Write step-by-step instructions. Put each step on a new line."}
                    rows={8}
                    required
                  />
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recipe Details */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Recipe Details</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Prep Time (minutes)"
                    type="number"
                    placeholder="30"
                    value={formData.prepTime || ''}
                    onChange={handleInputChange('prepTime')}
                    leftIcon={<Clock className="w-4 h-4" />}
                    error={errors.prepTime}
                    min="1"
                    max="1440"
                  />

                  <Input
                    label="Cook Time (minutes)"
                    type="number"
                    placeholder="45"
                    value={formData.cookTime || ''}
                    onChange={handleInputChange('cookTime')}
                    leftIcon={<ChefHat className="w-4 h-4" />}
                    error={errors.cookTime}
                    min="1"
                    max="1440"
                  />

                  <Input
                    label="Servings"
                    type="number"
                    placeholder="4"
                    value={formData.servings || ''}
                    onChange={handleInputChange('servings')}
                    leftIcon={<Users className="w-4 h-4" />}
                    error={errors.servings}
                    min="1"
                    max="50"
                  />

                  <Select
                    label="Difficulty Level"
                    value={formData.difficulty || ''}
                    onChange={handleInputChange('difficulty')}
                  >
                    <option value={Difficulty.EASY}>Easy</option>
                    <option value={Difficulty.MEDIUM}>Medium</option>
                    <option value={Difficulty.HARD}>Hard</option>
                  </Select>

                  <Input
                    label="Cuisine Type"
                    placeholder="Italian, Mexican, Asian..."
                    value={formData.cuisine || ''}
                    onChange={handleInputChange('cuisine')}
                  />
                </CardBody>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Tags</h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      disabled={!newTag.trim()}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Add Tag
                    </Button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-accent-600 dark:hover:text-accent-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Original Recipe Info */}
              {recipe && (
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Recipe Info</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400">Created:</span>
                        <span className="font-medium">
                          {new Date(recipe.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {recipe.updatedAt !== recipe.createdAt && (
                        <div className="flex justify-between">
                          <span className="text-secondary-600 dark:text-secondary-400">Last Updated:</span>
                          <span className="font-medium">
                            {new Date(recipe.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRecipe