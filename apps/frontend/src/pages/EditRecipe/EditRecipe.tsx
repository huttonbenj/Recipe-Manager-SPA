/**
 * Edit recipe page component
 * Comprehensive form for editing existing recipes with validation and image upload
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, X, Plus, Minus, Clock, Users, ChefHat,
  Save, Eye, Camera, AlertCircle, Tag, Hash, User, Heart, Bookmark, Info
} from 'lucide-react'

// UI Components
import {
  Card, CardHeader, CardBody,
  Button, Input, Textarea, Select, Badge, Loading, Modal, ImageBadge
} from '@/components/ui'

// Services and hooks
import { uploadApi } from '@/services/api/upload'
import { useAuth } from '@/hooks/useAuth'
import { useRecipe, useUpdateRecipe } from '@/hooks/useRecipes'
import { formatCookTime } from '@/utils'

// Types
import { Difficulty } from '@/types'
import { useToast } from '@/context/ToastContext'

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
  const { user } = useAuth()
  const { error: showError } = useToast()

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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  // Fetch existing recipe data
  const { data: recipe, isLoading: isLoadingRecipe, error: recipeError } = useRecipe(id!)

  // Update recipe mutation
  const updateMutation = useUpdateRecipe()

  // Initialize form with existing recipe data
  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients?.length ? recipe.ingredients : [''],
        instructions: recipe.instructions || '',
        prepTime: recipe.prepTime || undefined,
        cookTime: recipe.cookTime || undefined,
        servings: recipe.servings || undefined,
        difficulty: recipe.difficulty || Difficulty.MEDIUM,
        cuisine: recipe.cuisine || '',
        tags: recipe.tags || [],
        imageUrl: recipe.imageUrl || ''
      })
      setPreviewImage('')
    }
  }, [recipe])

  // Track form changes for dirty state
  useEffect(() => {
    if (recipe) {
      const hasChanges = (
        formData.title !== (recipe.title || '') ||
        formData.description !== (recipe.description || '') ||
        JSON.stringify(formData.ingredients) !== JSON.stringify(recipe.ingredients || ['']) ||
        formData.instructions !== (recipe.instructions || '') ||
        formData.prepTime !== recipe.prepTime ||
        formData.cookTime !== recipe.cookTime ||
        formData.servings !== recipe.servings ||
        formData.difficulty !== recipe.difficulty ||
        formData.cuisine !== (recipe.cuisine || '') ||
        JSON.stringify(formData.tags) !== JSON.stringify(recipe.tags || []) ||
        formData.imageUrl !== (recipe.imageUrl || '') ||
        !!previewImage
      )
      setIsFormDirty(hasChanges)
    }
  }, [formData, recipe, previewImage])

  // Loading state
  if (isLoadingRecipe) {
    return <Loading variant="spinner" size="lg" text="Loading recipe..." fullScreen />
  }

  // Check if user owns this recipe
  if (recipe && user?.id !== recipe.authorId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-accent-500 dark:text-accent-400 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            You don&apos;t have permission to edit this recipe.
          </p>
          <Button onClick={() => navigate('/app/recipes')}>
            Browse Recipes
          </Button>
        </Card>
      </div>
    )
  }

  /**
   * Validate form data
   */
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Recipe title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Recipe title must be at least 3 characters'
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Recipe title must be less than 100 characters'
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Recipe description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    // Ingredients validation
    const validIngredients = formData.ingredients.filter(ing => ing.trim())
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required'
    } else if (validIngredients.length > 50) {
      newErrors.ingredients = 'Maximum 50 ingredients allowed'
    }

    // Instructions validation
    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Cooking instructions are required'
    } else if (formData.instructions.trim().length < 20) {
      newErrors.instructions = 'Instructions must be at least 20 characters'
    } else if (formData.instructions.trim().length > 5000) {
      newErrors.instructions = 'Instructions must be less than 5000 characters'
    }

    // Time validations
    if (formData.prepTime && (formData.prepTime < 1 || formData.prepTime > 1440)) {
      newErrors.prepTime = 'Prep time must be between 1 and 1440 minutes'
    }

    if (formData.cookTime && (formData.cookTime < 1 || formData.cookTime > 1440)) {
      newErrors.cookTime = 'Cook time must be between 1 and 1440 minutes'
    }

    if (formData.servings && (formData.servings < 1 || formData.servings > 50)) {
      newErrors.servings = 'Servings must be between 1 and 50'
    }

    return newErrors
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstError = Object.values(validationErrors)[0]
      if (firstError) showError(firstError as string)
      return
    }

    // Clean up ingredients (remove empty ones)
    const cleanedIngredients = formData.ingredients.filter(ing => ing.trim())

    const submitData = {
      ...formData,
      ingredients: cleanedIngredients,
      imageUrl: previewImage || formData.imageUrl || undefined
    }

    updateMutation.mutate({ id: id!, updates: submitData }, {
      onSuccess: () => {
        // Navigate back to recipe detail page
        navigate(`/app/recipes/${id}`)
      },
      onError: (error: any) => {
        setErrors({
          submit: error?.response?.data?.message || 'Failed to update recipe. Please try again.'
        })
      }
    })
  }

  /**
   * Handle image upload
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, submit: 'Image size must be less than 5MB' })
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, submit: 'Please select a valid image file' })
      return
    }

    setIsUploading(true)
    setErrors({ ...errors, submit: undefined })

    try {
      const uploadResponse = await uploadApi.uploadImage(file)
      setPreviewImage(uploadResponse.url)
      setFormData({ ...formData, imageUrl: uploadResponse.url })
    } catch (error) {
      console.error('Image upload failed:', error)
      setErrors({ ...errors, submit: 'Failed to upload image. Please try again.' })
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Remove uploaded image
   */
  const removeImage = () => {
    setPreviewImage('')
    setFormData({ ...formData, imageUrl: '' })
  }

  /**
   * Add new ingredient input
   */
  const addIngredient = () => {
    if (formData.ingredients.length < 50) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, '']
      })
    }
  }

  /**
   * Remove ingredient at index
   */
  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index)
      setFormData({ ...formData, ingredients: newIngredients })
    }
  }

  /**
   * Update ingredient value at index
   */
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index] = value
    setFormData({ ...formData, ingredients: newIngredients })
  }

  /**
   * Add new tag
   */
  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag && !formData.tags.includes(trimmedTag) && formData.tags.length < 20) {
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmedTag]
      })
      setNewTag('')
    }
  }

  /**
   * Remove tag
   */
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  /**
   * Handle input changes with type safety
   */
  const handleInputChange = (field: keyof RecipeFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'number' ?
      (e.target.value ? Number(e.target.value) : undefined) :
      e.target.value

    setFormData({ ...formData, [field]: value })

    // Clear field-specific errors when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  /**
   * Handle back navigation with unsaved changes warning
   */
  const handleBackClick = () => {
    if (isFormDirty) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?')
      if (!confirmLeave) return
    }
    navigate(`/app/recipes/${id}`)
  }

  /**
   * Handle preview modal
   */
  const handlePreview = () => {
    setIsPreviewModalOpen(true)
  }

  /**
   * Get difficulty badge variant for preview
   */
  const getDifficultyVariant = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success'
      case 'medium':
        return 'warning'
      case 'hard':
        return 'danger'
      default:
        return 'default'
    }
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
            The recipe you&apos;re trying to edit doesn&apos;t exist or you don&apos;t have permission to edit it.
          </p>
          <Button onClick={() => navigate('/app/recipes')}>
            Browse Recipes
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="shrink-0"
              size="sm"
            >
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100">Edit Recipe</h1>
              <p className="text-secondary-600 dark:text-secondary-400 mt-1 text-sm sm:text-base">
                Refine your culinary masterpiece
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handlePreview}
              leftIcon={<Eye className="w-4 h-4" />}
              className="px-4 sm:px-6"
              size="sm"
            >
              Preview
            </Button>
            <Button
              type="submit"
              form="recipe-form"
              disabled={updateMutation.isPending || !isFormDirty}
              leftIcon={updateMutation.isPending ? <Loading variant="spinner" size="sm" /> : <Save className="w-4 h-4" />}
              variant="primary"
              size="sm"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <form id="recipe-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Submit Error Display */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
              <div className="p-1 bg-red-100 dark:bg-red-800 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Error Updating Recipe</h4>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{errors.submit}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <ChefHat className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">Basic Information</h2>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Update your recipe&apos;s name and description</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-6">
                  <Input
                    label="Recipe Title"
                    placeholder="Enter a delicious recipe name (e.g., Grandma's Chocolate Chip Cookies)"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    error={errors.title}
                    required
                    className="text-lg"
                  />

                  <Textarea
                    label="Description"
                    placeholder="Describe your recipe and what makes it special. What inspired you to create it? What occasions is it perfect for?"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    error={!!errors.description}
                    helperText={errors.description || "A good description helps others understand what makes your recipe unique"}
                    rows={4}
                    required
                  />
                </CardBody>
              </Card>

              {/* Image Upload */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <Camera className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">Recipe Image</h2>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Update the mouth-watering photo of your dish</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {previewImage || formData.imageUrl ? (
                    <div className="relative group">
                      <img
                        src={previewImage || formData.imageUrl}
                        alt="Recipe preview"
                        className="w-full h-72 object-cover rounded-xl shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            leftIcon={<Camera className="w-4 h-4" />}
                            className="bg-white/90 text-secondary-900 hover:bg-white"
                          >
                            Change Image
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={removeImage}
                            leftIcon={<X className="w-4 h-4" />}
                            className="bg-red-500/90 hover:bg-red-600"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-xl p-12 text-center bg-gradient-to-br from-primary-50/50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/20 hover:from-primary-100/70 hover:to-primary-200/70 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 transition-all duration-200">
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
                        className="cursor-pointer flex flex-col items-center gap-4 group"
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loading variant="spinner" size="lg" />
                            <span className="text-primary-600 dark:text-primary-400 font-medium">Uploading image...</span>
                          </div>
                        ) : (
                          <>
                            <div className="p-4 bg-primary-100 dark:bg-primary-800 rounded-full group-hover:scale-110 transition-transform">
                              <Camera className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="space-y-2">
                              <span className="text-lg font-medium text-secondary-700 dark:text-secondary-300">Add Recipe Photo</span>
                              <p className="text-secondary-600 dark:text-secondary-400">Click to upload or drag and drop</p>
                              <p className="text-sm text-secondary-500 dark:text-secondary-500">PNG, JPG, WebP up to 5MB</p>
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Ingredients */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                        <Hash className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">Ingredients</h2>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">List all ingredients with measurements</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={addIngredient}
                      disabled={formData.ingredients.length >= 50}
                      leftIcon={<Plus className="w-4 h-4" />}
                      className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/40"
                    >
                      Add Ingredient
                    </Button>
                  </div>
                  {errors.ingredients && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.ingredients}</p>
                    </div>
                  )}
                </CardHeader>
                <CardBody className="space-y-4">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-secondary-50/50 dark:bg-secondary-700/30 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <Input
                        placeholder={`e.g., 2 cups all-purpose flour`}
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
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    💡 <strong>Tip:</strong> Be specific with measurements (e.g., &quot;2 cups diced onions&quot; instead of &quot;onions&quot;)
                  </div>
                </CardBody>
              </Card>

              {/* Instructions */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <ChefHat className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">Cooking Instructions</h2>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Step-by-step directions for perfect results</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <Textarea
                    placeholder="Step 1: Preheat your oven to 350°F (175°C) and grease a 9x13 inch baking dish.

Step 2: In a large mixing bowl, cream together the butter and sugars until light and fluffy, about 3-4 minutes.

Step 3: Add eggs one at a time, then vanilla extract, mixing well after each addition.

Step 4: In a separate bowl, whisk together flour, baking soda, and salt..."
                    value={formData.instructions}
                    onChange={handleInputChange('instructions')}
                    error={!!errors.instructions}
                    helperText={errors.instructions || "Write clear, numbered steps. Leave a blank line between each step for better readability."}
                    rows={12}
                    required
                    className="font-mono text-sm"
                  />
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Recipe Details */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Recipe Details</h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Timing and serving information</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-6">
                  <Input
                    label="Prep Time (minutes)"
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.prepTime || ''}
                    onChange={handleInputChange('prepTime')}
                    leftIcon={<Clock className="w-4 h-4" />}
                    error={errors.prepTime}
                    min="1"
                    max="1440"
                    helperText="Time to prepare ingredients"
                  />

                  <Input
                    label="Cook Time (minutes)"
                    type="number"
                    placeholder="e.g., 45"
                    value={formData.cookTime || ''}
                    onChange={handleInputChange('cookTime')}
                    leftIcon={<ChefHat className="w-4 h-4" />}
                    error={errors.cookTime}
                    min="1"
                    max="1440"
                    helperText="Active cooking/baking time"
                  />

                  <Input
                    label="Servings"
                    type="number"
                    placeholder="e.g., 4"
                    value={formData.servings || ''}
                    onChange={handleInputChange('servings')}
                    leftIcon={<Users className="w-4 h-4" />}
                    error={errors.servings}
                    min="1"
                    max="50"
                    helperText="Number of people this serves"
                  />

                  <Select
                    label="Difficulty Level"
                    value={formData.difficulty || ''}
                    onChange={handleInputChange('difficulty')}
                    helperText="How challenging is this recipe?"
                  >
                    <option value={Difficulty.EASY}>Easy - Perfect for beginners</option>
                    <option value={Difficulty.MEDIUM}>Medium - Some cooking experience helpful</option>
                    <option value={Difficulty.HARD}>Hard - Advanced techniques required</option>
                  </Select>

                  <Input
                    label="Cuisine Type"
                    placeholder="e.g., Italian, Mexican, Asian"
                    value={formData.cuisine || ''}
                    onChange={handleInputChange('cuisine')}
                    helperText="What type of cuisine is this?"
                  />
                </CardBody>
              </Card>

              {/* Tags */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Tags</h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Help others discover your recipe</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., dessert, quick, healthy"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                      className="flex-1"
                      helperText={`${formData.tags.length}/20 tags`}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      disabled={!newTag.trim() || formData.tags.length >= 20}
                      leftIcon={<Plus className="w-4 h-4" />}
                      className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/40"
                    >
                      Add
                    </Button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-secondary-500 dark:text-secondary-400 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    💡 <strong>Popular tags:</strong> vegetarian, vegan, gluten-free, quick, healthy, comfort-food, holiday, dessert
                  </div>
                </CardBody>
              </Card>

              {/* Original Recipe Info */}
              {recipe && (
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Recipe History</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                        <span className="text-secondary-600 dark:text-secondary-400">Created:</span>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          {new Date(recipe.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {recipe.updatedAt !== recipe.createdAt && (
                        <div className="flex justify-between items-center py-2 border-b border-secondary-200 dark:border-secondary-700">
                          <span className="text-secondary-600 dark:text-secondary-400">Last Updated:</span>
                          <span className="font-medium text-secondary-900 dark:text-secondary-100">
                            {new Date(recipe.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-secondary-600 dark:text-secondary-400">Total Favorites:</span>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          {recipe.favoritesCount || 0}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <Modal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          title="Recipe Preview"
          size="xl"
        >
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {/* Recipe Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                {formData.title || 'Recipe Title'}
              </h1>
              {formData.description && (
                <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-4">
                  {formData.description}
                </p>
              )}

              {/* Recipe meta info */}
              <div className="flex flex-wrap gap-4 py-3 border-t border-secondary-200 dark:border-secondary-700 text-sm">
                {formData.prepTime && (
                  <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span className="font-medium">{formatCookTime(formData.prepTime)}</span>
                    <span className="ml-1">prep</span>
                  </div>
                )}

                {formData.cookTime && (
                  <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span className="font-medium">{formatCookTime(formData.cookTime)}</span>
                    <span className="ml-1">cook</span>
                  </div>
                )}

                {formData.servings && (
                  <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                    <Users className="w-4 h-4 mr-1.5" />
                    <span className="font-medium">{formData.servings}</span>
                    <span className="ml-1">serving{formData.servings !== 1 ? 's' : ''}</span>
                  </div>
                )}

                {formData.cuisine && (
                  <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                    <ChefHat className="w-4 h-4 mr-1.5" />
                    <span className="font-medium capitalize">{formData.cuisine}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recipe Image */}
                {(previewImage || formData.imageUrl) && (
                  <div className="relative rounded-xl overflow-hidden shadow-md">
                    <img
                      src={previewImage || formData.imageUrl}
                      alt="Recipe preview"
                      className="w-full h-auto object-cover"
                    />
                    {/* Image badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                      {formData.difficulty && (
                        <ImageBadge
                          variant={getDifficultyVariant(formData.difficulty) as 'success' | 'warning' | 'danger' | 'info' | 'default'}
                        >
                          {formData.difficulty}
                        </ImageBadge>
                      )}
                      {formData.tags?.slice(0, 2).map((tag: string) => (
                        <ImageBadge
                          key={tag}
                          variant="default"
                        >
                          {tag}
                        </ImageBadge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                <Card variant="bordered">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 flex items-center">
                      <span className="bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100 p-1.5 rounded-md mr-2">
                        <ChefHat className="w-5 h-5" />
                      </span>
                      Ingredients
                    </h2>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <ul className="space-y-2">
                      {formData.ingredients?.filter(ing => ing.trim()).map((ingredient: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100 text-xs flex items-center justify-center mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-secondary-900 dark:text-secondary-100">
                            {ingredient}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>

                {/* Instructions */}
                <Card variant="bordered">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 flex items-center">
                      <span className="bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100 p-1.5 rounded-md mr-2">
                        <ChefHat className="w-5 h-5" />
                      </span>
                      Instructions
                    </h2>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <div className="space-y-4">
                      {formData.instructions ? (
                        formData.instructions.split('\n\n').filter(Boolean).map((step: string, index: number) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100 font-medium border border-primary-200 dark:border-primary-700 shadow-sm">
                                {index + 1}
                              </div>
                            </div>
                            <div className="text-secondary-900 dark:text-secondary-100">
                              {step}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-secondary-500 dark:text-secondary-400 italic">
                          No instructions added yet
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Author info */}
                {user && (
                  <Card variant="bordered">
                    <CardBody>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                        About the Author
                      </h3>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-100 mr-3">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-secondary-100">
                            {user.name || user.email.split('@')[0]}
                          </p>
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            Recipe Creator
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Recipe Stats */}
                <Card variant="bordered">
                  <CardBody>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                      Recipe Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400 flex items-center">
                          <Heart className="w-4 h-4 mr-2" />
                          Favorites
                        </span>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          {recipe?.favoritesCount || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400 flex items-center">
                          <Bookmark className="w-4 h-4 mr-2" />
                          Bookmarks
                        </span>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          {recipe?.bookmarksCount || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400 flex items-center">
                          <Info className="w-4 h-4 mr-2" />
                          Status
                        </span>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          {isFormDirty ? 'Modified' : 'Published'}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Tags Preview */}
                {formData.tags && formData.tags.length > 0 && (
                  <Card variant="bordered">
                    <CardBody>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Tips */}
                <Card variant="glass">
                  <CardBody>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-primary-500 dark:text-primary-400" />
                      Preview Note
                    </h3>
                    <div className="text-secondary-600 dark:text-secondary-400 space-y-2">
                      <p>
                        This is how your recipe will look with the current changes. You can continue editing and preview again before saving.
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default EditRecipe