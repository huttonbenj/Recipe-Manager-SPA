/**
 * Create recipe page component
 * Comprehensive form for creating new recipes with validation and image upload
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, X, Plus, Minus, Clock, Users, ChefHat,
  Save, Eye, Camera, AlertCircle, User, Heart, Bookmark, Info, ChevronRight, Tag
} from 'lucide-react'

// UI Components
import {
  Card, CardHeader, CardBody,
  Button, Input, Textarea, Select, Badge, Loading, Modal, ImageBadge
} from '@/components/ui'

// Services and hooks
import { uploadApi } from '@/services/api/upload'
import { useAuth } from '@/hooks/useAuth'
import { useCreateRecipe } from '@/hooks/useRecipes'
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

const CreateRecipe: React.FC = () => {
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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  // Create recipe mutation
  const createMutation = useCreateRecipe()

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
      // Show the first validation error in a toast for quick feedback
      const firstError = Object.values(formErrors)[0]
      if (firstError) {
        showError(firstError as string)
      }
      return
    }

    // Clean up ingredients
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(ing => ing.trim()),
    }

    createMutation.mutate(cleanedData, {
      onSuccess: (newRecipe) => {
        // Navigate to the new recipe detail page to show the created recipe
        navigate(`/recipes/${newRecipe.id}`)
      },
      onError: (error: any) => {
        setErrors({
          submit: error?.response?.data?.message || 'Failed to create recipe. Please try again.'
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
    } catch (error) {
      setErrors({ submit: 'Failed to upload image. Please try again.' })
      setPreviewImage('')
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
  }

  /**
   * Add new ingredient field
   */
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }))
  }

  /**
   * Remove ingredient field
   */
  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  /**
   * Update ingredient value
   */
  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }))
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
  }

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof RecipeFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || undefined : e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="shrink-0"
              size="sm"
            >
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100">Create New Recipe</h1>
              <p className="text-secondary-600 dark:text-secondary-400 mt-1 text-sm sm:text-base">Share your culinary creation with the world</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
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
              disabled={createMutation.isPending}
              leftIcon={createMutation.isPending ? <Loading variant="spinner" size="sm" /> : <Save className="w-4 h-4" />}
              className="px-4 sm:px-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              size="sm"
            >
              <span className="hidden sm:inline">{createMutation.isPending ? 'Creating...' : 'Create Recipe'}</span>
              <span className="sm:hidden">{createMutation.isPending ? 'Creating...' : 'Create'}</span>
            </Button>
          </div>
        </div>

        <form id="recipe-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Submit Error Display */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
              <div className="p-1 bg-red-100 dark:bg-red-800 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Error Creating Recipe</h4>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{errors.submit}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Basic Information */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <ChefHat className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100">Basic Information</h2>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Give your recipe a name and description</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4 sm:space-y-6">
                  <Input
                    label="Recipe Title"
                    placeholder="Enter a delicious recipe name (e.g., Grandma's Chocolate Chip Cookies)"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    error={errors.title}
                    required
                    className="text-base sm:text-lg"
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
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <Camera className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100">Recipe Image</h2>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Add a mouth-watering photo of your dish</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {previewImage || formData.imageUrl ? (
                    <div className="relative group">
                      <img
                        src={previewImage || formData.imageUrl}
                        alt="Recipe preview"
                        className="w-full h-48 sm:h-72 object-cover rounded-xl shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <div className="flex gap-2 sm:gap-3">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            leftIcon={<Camera className="w-4 h-4" />}
                            className="bg-white/90 text-secondary-900 hover:bg-white text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">Change Image</span>
                            <span className="sm:hidden">Change</span>
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={removeImage}
                            leftIcon={<X className="w-4 h-4" />}
                            className="bg-red-500/90 hover:bg-red-600 text-xs sm:text-sm"
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
                    <div className="border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-xl p-6 sm:p-12 text-center bg-gradient-to-br from-primary-50/50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/20 hover:from-primary-100/70 hover:to-primary-200/70 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 transition-all duration-200">
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
                        className="cursor-pointer flex flex-col items-center gap-3 sm:gap-4 group"
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loading variant="spinner" size="lg" />
                            <span className="text-primary-600 dark:text-primary-400 font-medium text-sm sm:text-base">Uploading image...</span>
                          </div>
                        ) : (
                          <>
                            <div className="p-3 sm:p-4 bg-primary-100 dark:bg-primary-800 rounded-full group-hover:scale-110 transition-transform">
                              <Camera className="w-6 sm:w-8 h-6 sm:h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <span className="text-base sm:text-lg font-medium text-secondary-700 dark:text-secondary-300">Add Recipe Photo</span>
                              <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base">Click to upload or drag and drop</p>
                              <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-500">PNG, JPG, WebP up to 5MB</p>
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
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                        <ChefHat className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100">Ingredients</h2>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">List all ingredients with measurements</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={addIngredient}
                      leftIcon={<Plus className="w-4 h-4" />}
                      className="shrink-0"
                    >
                      <span className="hidden sm:inline">Add Ingredient</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </div>
                  {errors.ingredients && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">{errors.ingredients}</p>
                    </div>
                  )}
                </CardHeader>
                <CardBody className="space-y-4">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium shrink-0">
                          {index + 1}
                        </div>
                        <Input
                          placeholder={`e.g., 2 cups all-purpose flour, 1 tsp vanilla extract`}
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
                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                            leftIcon={<Minus className="w-4 h-4" />}
                          >
                            <span className="hidden sm:inline">Remove</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {formData.ingredients.length < 20 && (
                    <div className="mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                        💡 <strong>Tips:</strong> Include measurements (cups, tablespoons, etc.) and be specific about ingredient types
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addIngredient}
                        leftIcon={<Plus className="w-4 h-4" />}
                        className="w-full border-dashed"
                      >
                        Add Another Ingredient
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Instructions */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <ChevronRight className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100">Cooking Instructions</h2>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Provide clear, step-by-step directions</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Step 1: Preheat your oven to 350°F (175°C) and grease a 9x13 inch baking pan.

Step 2: In a large mixing bowl, cream together the butter and sugar until light and fluffy, about 3-4 minutes.

Step 3: Add eggs one at a time, beating well after each addition. Mix in vanilla extract.

Step 4: In a separate bowl, whisk together flour, baking powder, and salt..."
                      value={formData.instructions}
                      onChange={handleInputChange('instructions')}
                      error={!!errors.instructions}
                      helperText={errors.instructions || "Write numbered steps separated by blank lines. Include temperatures, times, and visual cues."}
                      rows={12}
                      required
                      className="min-h-[300px]"
                    />
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Writing Great Instructions</h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Start each step with &quot;Step 1:&quot;, &quot;Step 2:&quot;, etc.</li>
                        <li>• Include specific temperatures, times, and measurements</li>
                        <li>• Describe what to look for (e.g., &quot;until golden brown&quot;)</li>
                        <li>• Separate each step with a blank line</li>
                        <li>• Be clear about equipment needed for each step</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 sm:space-y-8">
              {/* Recipe Details */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100">Recipe Details</h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Time, servings, and difficulty</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Prep Time"
                      type="number"
                      placeholder="30"
                      value={formData.prepTime || ''}
                      onChange={handleInputChange('prepTime')}
                      leftIcon={<Clock className="w-4 h-4" />}
                      error={errors.prepTime}
                      helperText="minutes"
                      min="1"
                      max="1440"
                    />

                    <Input
                      label="Cook Time"
                      type="number"
                      placeholder="45"
                      value={formData.cookTime || ''}
                      onChange={handleInputChange('cookTime')}
                      leftIcon={<ChefHat className="w-4 h-4" />}
                      error={errors.cookTime}
                      helperText="minutes"
                      min="1"
                      max="1440"
                    />
                  </div>

                  <Input
                    label="Servings"
                    type="number"
                    placeholder="4"
                    value={formData.servings || ''}
                    onChange={handleInputChange('servings')}
                    leftIcon={<Users className="w-4 h-4" />}
                    error={errors.servings}
                    helperText="number of people"
                    min="1"
                    max="50"
                  />

                  <Select
                    label="Difficulty Level"
                    value={formData.difficulty || ''}
                    onChange={handleInputChange('difficulty')}
                  >
                    <option value="">Select difficulty...</option>
                    <option value={Difficulty.EASY}>🟢 Easy - Perfect for beginners</option>
                    <option value={Difficulty.MEDIUM}>🟡 Medium - Some cooking experience helpful</option>
                    <option value={Difficulty.HARD}>🔴 Hard - Advanced cooking skills required</option>
                  </Select>

                  <Input
                    label="Cuisine Type"
                    placeholder="e.g., Italian, Mexican, Asian, American..."
                    value={formData.cuisine || ''}
                    onChange={handleInputChange('cuisine')}
                    leftIcon={<ChefHat className="w-4 h-4" />}
                  />
                </CardBody>
              </Card>

              {/* Tags */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100">Tags</h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Help others discover your recipe</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="e.g., vegetarian, quick, comfort food..."
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
                      disabled={!newTag.trim() || formData.tags.length >= 10}
                      leftIcon={<Plus className="w-4 h-4" />}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Popular Tags Suggestions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Popular tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {['vegetarian', 'quick', 'healthy', 'comfort food', 'dessert', 'breakfast', 'dinner', 'appetizer'].map((suggestedTag) => (
                        !formData.tags.includes(suggestedTag) && (
                          <button
                            key={suggestedTag}
                            type="button"
                            onClick={() => {
                              if (formData.tags.length < 10) {
                                setFormData(prev => ({
                                  ...prev,
                                  tags: [...prev.tags, suggestedTag]
                                }))
                              }
                            }}
                            className="px-2 py-1 text-xs bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                          >
                            + {suggestedTag}
                          </button>
                        )
                      ))}
                    </div>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        Your tags ({formData.tags.length}/10):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="primary"
                            className="flex items-center gap-1.5 px-3 py-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-primary-200 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Form Progress & Tips */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                      <Info className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-200">Recipe Progress</h3>
                      <p className="text-sm text-green-600 dark:text-green-400">Complete all sections for best results</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  {/* Progress Checklist */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.title ? 'bg-green-500' : 'bg-secondary-300 dark:bg-secondary-600'}`}>
                        {formData.title && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-sm ${formData.title ? 'text-green-700 dark:text-green-300' : 'text-secondary-600 dark:text-secondary-400'}`}>
                        Recipe title
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.description ? 'bg-green-500' : 'bg-secondary-300 dark:bg-secondary-600'}`}>
                        {formData.description && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-sm ${formData.description ? 'text-green-700 dark:text-green-300' : 'text-secondary-600 dark:text-secondary-400'}`}>
                        Description
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.ingredients.some(ing => ing.trim()) ? 'bg-green-500' : 'bg-secondary-300 dark:bg-secondary-600'}`}>
                        {formData.ingredients.some(ing => ing.trim()) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-sm ${formData.ingredients.some(ing => ing.trim()) ? 'text-green-700 dark:text-green-300' : 'text-secondary-600 dark:text-secondary-400'}`}>
                        Ingredients ({formData.ingredients.filter(ing => ing.trim()).length})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.instructions ? 'bg-green-500' : 'bg-secondary-300 dark:bg-secondary-600'}`}>
                        {formData.instructions && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-sm ${formData.instructions ? 'text-green-700 dark:text-green-300' : 'text-secondary-600 dark:text-secondary-400'}`}>
                        Instructions
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.imageUrl || previewImage ? 'bg-green-500' : 'bg-secondary-300 dark:bg-secondary-600'}`}>
                        {(formData.imageUrl || previewImage) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-sm ${formData.imageUrl || previewImage ? 'text-green-700 dark:text-green-300' : 'text-secondary-600 dark:text-secondary-400'}`}>
                        Recipe photo (optional)
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-green-200 dark:border-green-800">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">💡 Tips for Success</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Use specific measurements (cups, tablespoons, etc.)</li>
                      <li>• Include cooking temperatures and times</li>
                      <li>• Add visual cues (&quot;until golden brown&quot;)</li>
                      <li>• Test your recipe before sharing</li>
                      <li>• High-quality photos increase engagement</li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
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
          size="lg"
        >
          <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6">
            {/* Recipe Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                {formData.title || 'Recipe Title'}
              </h1>
              {formData.description && (
                <p className="text-base sm:text-lg text-secondary-600 dark:text-secondary-400 mb-4">
                  {formData.description}
                </p>
              )}

              {/* Recipe meta info */}
              <div className="flex flex-wrap gap-3 sm:gap-4 py-3 border-t border-secondary-200 dark:border-secondary-700 text-sm">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
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
                    <h2 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 flex items-center">
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
                          <span className="text-secondary-900 dark:text-secondary-100 text-sm sm:text-base">
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
                    <h2 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 flex items-center">
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
                          <div key={index} className="flex gap-3 sm:gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100 font-medium border border-primary-200 dark:border-primary-700 shadow-sm">
                                {index + 1}
                              </div>
                            </div>
                            <div className="text-secondary-900 dark:text-secondary-100 text-sm sm:text-base">
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
              <div className="space-y-4 sm:space-y-6">
                {/* Author info */}
                {user && (
                  <Card variant="bordered">
                    <CardBody>
                      <h3 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                        About the Author
                      </h3>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-100 mr-3">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-secondary-100 text-sm sm:text-base">
                            {user.name || user.email.split('@')[0]}
                          </p>
                          <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400">
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
                    <h3 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                      Recipe Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400 flex items-center text-sm">
                          <Heart className="w-4 h-4 mr-2" />
                          Favorites
                        </span>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          0
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400 flex items-center text-sm">
                          <Bookmark className="w-4 h-4 mr-2" />
                          Bookmarks
                        </span>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          0
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400 flex items-center text-sm">
                          <Info className="w-4 h-4 mr-2" />
                          Status
                        </span>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          Draft
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Tags Preview */}
                {formData.tags && formData.tags.length > 0 && (
                  <Card variant="bordered">
                    <CardBody>
                      <h3 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
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
                    <h3 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-primary-500 dark:text-primary-400" />
                      Preview Note
                    </h3>
                    <div className="text-secondary-600 dark:text-secondary-400 space-y-2 text-sm">
                      <p>
                        This is how your recipe will look once published. You can continue editing and preview again before saving.
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

export default CreateRecipe