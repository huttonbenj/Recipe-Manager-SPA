/**
 * Recipe detail page component
 * Displays comprehensive recipe information with interactive features
 */

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Clock, Users, ChefHat, Heart, Share2, Edit, Trash2,
  ArrowLeft, Bookmark, Camera, CheckCircle, Circle,
  ChevronRight, Info, User, PlayCircle, Calendar, Sparkles
} from 'lucide-react'

// UI Components
import {
  Card, CardHeader, CardBody,
  Button, Loading, Modal, ImageBadge
} from '@/components/ui'

// Services and hooks
import { useAuth } from '@/hooks/useAuth'
import { useRecipe, useDeleteRecipe } from '@/hooks/useRecipes'
import { useFavorites } from '@/hooks/useFavorites'
import { useToast } from '@/context/ToastContext'
import { formatCookTime } from '@/utils'

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
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

  // Delete recipe mutation
  const deleteMutation = useDeleteRecipe()

  // Fetch recipe data - disable during deletion to prevent 404 errors
  const { data: recipe, isLoading, error: queryError } = useRecipe(id!, {
    enabled: !deleteMutation.isPending && !deleteMutation.isSuccess,
  })

  // Loading state
  if (isLoading) {
    return <Loading variant="spinner" size="lg" text="Loading recipe..." fullScreen />
  }

  // Error state
  if (queryError) {
    return <div>Error loading recipe</div>
  }

  // Recipe not found
  if (!recipe) {
    return <div>Recipe not found</div>
  }

  // Check if user can edit/delete this recipe
  const canEdit = user?.id === recipe.authorId

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

  // Handle delete
  const handleDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    deleteMutation.mutate(id!, {
      onSuccess: () => {
        // Close the modal
        setIsDeleteModalOpen(false)
        // Navigate back to recipes list after deletion
        navigate('/app/recipes', { replace: true })
      }
    })
  }

  // Get difficulty badge variant
  const getDifficultyVariant = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success'
      case 'medium':
        return 'warning'
      case 'hard':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/app/recipes')}
            className="w-fit"
            leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Recipes
          </Button>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleShare}
              aria-label="Share recipe"
              leftIcon={<Share2 className="w-4 h-4" />}>
              <span className="hidden sm:inline">Share</span>
            </Button>

            {isAuthenticated && (
              <>
                <Button
                  variant={isFavorited(recipe.id) ? "primary" : "outline"}
                  onClick={() => toggleFavorite(recipe.id, isFavorited(recipe.id))}
                  disabled={isAddingToFavorites || isRemovingFromFavorites}
                  aria-label={isFavorited(recipe.id) ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={isFavorited(recipe.id)}
                  leftIcon={<Heart className={`w-4 h-4 ${isFavorited(recipe.id) ? 'fill-current' : ''}`} />}>
                  <span className="hidden sm:inline">
                    {isFavorited(recipe.id) ? 'Favorited' : 'Favorite'}
                  </span>
                </Button>
                <Button
                  variant={isBookmarked(recipe.id) ? "primary" : "outline"}
                  onClick={() => toggleBookmark(recipe.id, isBookmarked(recipe.id))}
                  disabled={isAddingToBookmarks || isRemovingFromBookmarks}
                  aria-label={isBookmarked(recipe.id) ? "Remove bookmark" : "Bookmark recipe"}
                  aria-pressed={isBookmarked(recipe.id)}
                  leftIcon={<Bookmark className={`w-4 h-4 ${isBookmarked(recipe.id) ? 'fill-current' : ''}`} />}>
                  <span className="hidden sm:inline">
                    {isBookmarked(recipe.id) ? 'Bookmarked' : 'Bookmark'}
                  </span>
                </Button>
              </>
            )}

            {canEdit && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/app/recipes/${id}/edit`)}
                  leftIcon={<Edit className="w-4 h-4" />}>
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  leftIcon={<Trash2 className="w-4 h-4" />}>
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Header */}
            <Card variant="bordered">
              <CardHeader className="pb-0">
                <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                  {recipe.title}
                </h1>

                {recipe.description && (
                  <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-4">
                    {recipe.description}
                  </p>
                )}

                {/* Recipe meta info */}
                <div className="flex flex-wrap gap-4 py-3 border-t border-secondary-200 dark:border-secondary-700 text-sm">
                  {recipe.prepTime && (
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                      <Clock className="w-4 h-4 mr-1.5" />
                      <span className="font-medium">{formatCookTime(recipe.prepTime)}</span>
                      <span className="ml-1">prep</span>
                    </div>
                  )}

                  {recipe.cookTime && (
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                      <Clock className="w-4 h-4 mr-1.5" />
                      <span className="font-medium">{formatCookTime(recipe.cookTime)}</span>
                      <span className="ml-1">cook</span>
                    </div>
                  )}

                  {recipe.servings && (
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                      <Users className="w-4 h-4 mr-1.5" />
                      <span className="font-medium">{recipe.servings}</span>
                      <span className="ml-1">serving{recipe.servings !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {recipe.cuisine && (
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                      <ChefHat className="w-4 h-4 mr-1.5" />
                      <span className="font-medium capitalize">{recipe.cuisine}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Recipe Image */}
            {recipe.imageUrl && (
              <div className="relative rounded-xl overflow-hidden shadow-md">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-auto object-cover"
                />
                {/* Image badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                  {recipe.difficulty && (
                    <ImageBadge
                      variant={getDifficultyVariant(recipe.difficulty) as 'success' | 'warning' | 'danger' | 'info' | 'default'}
                    >
                      {recipe.difficulty}
                    </ImageBadge>
                  )}
                  {recipe.tags?.slice(0, 2).map((tag: string) => (
                    <ImageBadge
                      key={tag}
                      variant="default"
                    >
                      {tag}
                    </ImageBadge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="absolute bottom-4 right-4 bg-white/90 dark:bg-secondary-800 backdrop-blur-sm hover:bg-white dark:hover:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
                  onClick={() => setIsImageModalOpen(true)}
                  leftIcon={<Camera className="w-4 h-4" />}
                >
                  View Full Image
                </Button>
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
                  <Info className="w-4 h-4 ml-2 text-secondary-500 dark:text-secondary-400" />
                </h2>
              </CardHeader>
              <CardBody className="pt-0">
                <ul className="space-y-2">
                  {recipe.ingredients?.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <button
                        onClick={() => toggleIngredient(index)}
                        className="flex-shrink-0 mt-0.5 cursor-pointer hover:scale-110 transition-transform"
                        aria-label={checkedIngredients.has(index) ? "Mark ingredient as not used" : "Mark ingredient as used"}
                      >
                        {checkedIngredients.has(index) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-secondary-400 dark:text-secondary-500" />
                        )}
                      </button>
                      <span className={`transition-all ${checkedIngredients.has(index)
                        ? 'text-secondary-500 dark:text-secondary-400 line-through'
                        : 'text-secondary-900 dark:text-secondary-100'}`}>
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
                    <PlayCircle className="w-5 h-5" />
                  </span>
                  Instructions
                  <ChevronRight className="w-4 h-4 ml-2 text-secondary-500 dark:text-secondary-400" />
                </h2>
              </CardHeader>
              <CardBody className="pt-0">
                <ol className="space-y-6 list-none">
                  {recipe.instructions?.split('\n\n').filter(Boolean).map((step: string, index: number) => (
                    <li key={index} className="flex gap-4">
                      <button
                        onClick={() => toggleInstruction(index)}
                        className="flex-shrink-0 mt-1 cursor-pointer hover:scale-110 transition-transform"
                        aria-label={checkedInstructions.has(index) ? "Mark step as incomplete" : "Mark step as complete"}
                      >
                        {checkedInstructions.has(index) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-secondary-400 dark:text-secondary-500" />
                        )}
                      </button>
                      <div className={`transition-all ${checkedInstructions.has(index)
                        ? 'text-secondary-500 dark:text-secondary-400'
                        : 'text-secondary-900 dark:text-secondary-100'}`}>
                        <span className="font-medium text-primary-600 dark:text-primary-400">
                          Step {index + 1}:
                        </span>
                        <span className="ml-2">{step}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author info */}
            {recipe.author && (
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
                        {recipe.author.name || recipe.author.email.split('@')[0]}
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
                      {recipe.favoritesCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600 dark:text-secondary-400 flex items-center">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Bookmarks
                    </span>
                    <span className="font-medium text-secondary-900 dark:text-secondary-100">
                      {recipe.bookmarksCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600 dark:text-secondary-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created
                    </span>
                    <span className="font-medium text-secondary-900 dark:text-secondary-100">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Tips and Notes */}
            <Card variant="glass">
              <CardBody>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-primary-500 dark:text-primary-400" />
                  Tips & Notes
                </h3>
                <div className="text-secondary-600 dark:text-secondary-400 space-y-2">
                  <p>
                    Check off ingredients and steps as you go. Your progress will be saved for this session.
                  </p>
                  <p>
                    Adjust servings as needed for your group size. The ingredient quantities will update automatically.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && recipe.imageUrl && (
        <Modal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          title={recipe.title}
          size="lg"
        >
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-auto object-contain max-h-[80vh]"
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Recipe"
          size="sm"
        >
          <div className="p-6">
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              Are you sure you want to delete this recipe? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Recipe'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default RecipeDetail