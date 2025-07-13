/**
 * Recipe detail page component
 * Displays comprehensive recipe information with interactive features
 */

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Clock, Users, ChefHat, Star, Heart, Share2, Edit3, Trash2,
  ArrowLeft, Bookmark, MessageCircle, Camera, CheckCircle, Circle
} from 'lucide-react'

// UI Components
import {
  Card, CardHeader, CardBody,
  Button, Loading, Modal, ConfirmModal, Badge
} from '@/components/ui'

// Services and hooks
import { recipesApi } from '@/services/api/recipes'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { useToast } from '@/context/ToastContext'
import { formatCookTime, formatRelativeTime } from '@/utils'

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, isAuthenticated } = useAuth()
  const { success, error } = useToast()

  // Favorites and bookmarks
  const {
    toggleFavorite,
    toggleBookmark,
    isFavorited,
    isBookmarked,
    isAddingToFavorites,
    isRemovingFromFavorites,
    isAddingToBookmarks,
    isRemovingFromBookmarks
  } = useFavorites()

  // UI state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [checkedInstructions, setCheckedInstructions] = useState<Set<number>>(new Set())

  // Fetch recipe data
  const { data: recipe, isLoading, error: queryError } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipesApi.getRecipe(id!),
    enabled: !!id,
  })

  // Delete recipe mutation
  const deleteMutation = useMutation({
    mutationFn: () => recipesApi.deleteRecipe(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      success('Recipe deleted successfully')
      navigate('/recipes')
    },
    onError: () => {
      error('Failed to delete recipe. Please try again.')
    }
  })

  // Loading state
  if (isLoading) {
    return <Loading variant="spinner" size="lg" text="Loading recipe..." fullScreen />
  }

  // Error state
  if (queryError || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <ChefHat className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Recipe Not Found</h2>
          <p className="text-gray-600 mb-4">
            The recipe you're looking for doesn't exist or may have been removed.
          </p>
          <Button onClick={() => navigate('/recipes')}>
            Browse Recipes
          </Button>
        </Card>
      </div>
    )
  }

  // Check if user owns this recipe
  const isOwner = user?.id === recipe.authorId

  // Handle ingredient checkbox toggle
  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedIngredients(newChecked)
  }

  // Handle instruction checkbox toggle
  const toggleInstruction = (index: number) => {
    const newChecked = new Set(checkedInstructions)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedInstructions(newChecked)
  }

  // Handle recipe sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        })
        success('Recipe shared successfully!')
      } catch (shareError) {
        // User cancelled sharing
        if (shareError instanceof Error && shareError.name !== 'AbortError') {
          error('Failed to share recipe')
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        success('Recipe link copied to clipboard!')
      } catch (clipboardError) {
        error('Failed to copy link to clipboard')
      }
    }
  }

  // Handle recipe deletion
  const handleDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    deleteMutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>

            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => toggleFavorite(recipe.id, isFavorited(recipe.id))}
                  disabled={isAddingToFavorites || isRemovingFromFavorites}
                  className="flex items-center gap-2"
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorited(recipe.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                  />
                  {isFavorited(recipe.id) ? 'Favorited' : 'Favorite'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => toggleBookmark(recipe.id, isBookmarked(recipe.id))}
                  disabled={isAddingToBookmarks || isRemovingFromBookmarks}
                  className="flex items-center gap-2"
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked(recipe.id) ? 'text-blue-500 fill-current' : 'text-gray-600'}`}
                  />
                  {isBookmarked(recipe.id) ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </>
            )}

            {isOwner && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/recipes/${id}/edit`)}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {recipe.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {recipe.title}
                </h1>

                {recipe.description && (
                  <p className="text-lg text-gray-600 mb-4">
                    {recipe.description}
                  </p>
                )}

                {/* Meta information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  {recipe.prepTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Prep: {formatCookTime(recipe.prepTime)}</span>
                    </div>
                  )}

                  {recipe.cookTime && (
                    <div className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      <span>Cook: {formatCookTime(recipe.cookTime)}</span>
                    </div>
                  )}

                  {recipe.servings && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  )}

                  {recipe.difficulty && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span className="capitalize">{recipe.difficulty}</span>
                    </div>
                  )}
                </div>

                {/* Author info */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    By <span className="font-medium">{recipe.author?.name || 'Anonymous'}</span>
                    {recipe.createdAt && (
                      <span> • {formatRelativeTime(recipe.createdAt)}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Recipe Image */}
            {recipe.imageUrl && (
              <Card padding="none">
                <div
                  className="relative cursor-pointer"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            )}

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Ingredients</h2>
                <p className="text-sm text-gray-500">
                  Check off ingredients as you gather them
                </p>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {recipe.ingredients?.map((ingredient: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleIngredient(index)}
                    >
                      {checkedIngredients.has(index) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={`flex-1 ${checkedIngredients.has(index) ? 'line-through text-gray-500' : ''}`}>
                        {ingredient}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Instructions</h2>
                <p className="text-sm text-gray-500">
                  Check off steps as you complete them
                </p>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {recipe.instructions?.split('\n').map((instruction: string, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 p-3 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleInstruction(index)}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {checkedInstructions.has(index) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-medium flex items-center justify-center">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <p className={`flex-1 ${checkedInstructions.has(index) ? 'line-through text-gray-500' : ''}`}>
                        {instruction.trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Quick Actions</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button variant="primary" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Save Recipe
                </Button>

                <Button variant="secondary" className="w-full" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Recipe
                </Button>

                <Button variant="secondary" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Leave Review
                </Button>
              </CardBody>
            </Card>

            {/* Nutrition Info */}
            {recipe.cuisine && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Recipe Info</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cuisine:</span>
                      <span className="font-medium capitalize">{recipe.cuisine}</span>
                    </div>
                    {recipe.difficulty && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <span className="font-medium capitalize">{recipe.difficulty}</span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Similar Recipes */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">You Might Also Like</h3>
              </CardHeader>
              <CardBody>
                <div className="text-sm text-gray-500">
                  Similar recipe suggestions coming soon...
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {recipe.imageUrl && (
        <Modal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          size="xl"
          showCloseButton
        >
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-auto max-h-screen object-contain"
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default RecipeDetail