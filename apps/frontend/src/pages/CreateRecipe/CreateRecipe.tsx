/**
 * Create recipe page component
 * Comprehensive form for creating new recipes with validation and image upload
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
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

const CreateRecipe: React.FC = () => {
  const navigate = useNavigate()

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

  // Create recipe mutation
  const createMutation = useMutation({
    mutationFn: recipesApi.createRecipe,
    onSuccess: (recipe) => {
      navigate(`/recipes/${recipe.id}`)
    },
    onError: (error: any) => {
      setErrors({
        submit: error?.response?.data?.message || 'Failed to create recipe. Please try again.'
      })
    }
  })

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

    createMutation.mutate(cleanedData)
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Recipe</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/recipes')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              type="submit"
              form="recipe-form"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loading variant="spinner" size="sm" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Recipe
                </>
              )}
            </Button>
          </div>
        </div>

        <form id="recipe-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Submit Error Display */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-600">{errors.submit}</p>
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
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                            <Camera className="w-12 h-12 text-gray-400" />
                            <span className="text-gray-600">Click to upload recipe image</span>
                            <span className="text-sm text-gray-500">PNG, JPG up to 5MB</span>
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
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {errors.ingredients && (
                    <p className="text-sm text-red-600">{errors.ingredients}</p>
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
                        >
                          <Minus className="w-4 h-4" />
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
                    label="Cooking Instructions"
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
                    >
                      <Plus className="w-4 h-4" />
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
                            className="hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Tips for Great Recipes</h3>
                </CardHeader>
                <CardBody>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Use specific measurements and clear instructions</li>
                    <li>• Include prep and cook times</li>
                    <li>• Add helpful tips and variations</li>
                    <li>• Use high-quality photos</li>
                    <li>• Test your recipe before sharing</li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRecipe