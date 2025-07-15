/**
 * Recipe detail page component
 * Displays comprehensive recipe information with interactive features
 */
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock, Users, ChefHat, Heart, Share2, Edit, Trash2,
  ArrowLeft, Bookmark, Camera, CheckCircle, Circle,
  User, BarChart, Tag, ExternalLink
} from 'lucide-react';

// UI Components
import {
  Card, Button, Loading, Modal, Badge
} from '@/components/ui';

// Services and hooks
import { useAuth } from '@/hooks/useAuth';
import { useRecipe, useDeleteRecipe } from '@/hooks/useRecipes';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/context/ToastContext';
import { formatCookTime } from '@/utils';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const {
    toggleFavorite,
    toggleBookmark,
    isFavorited,
    isBookmarked,
    isAddingToFavorites,
    isRemovingFromFavorites,
    isAddingToBookmarks,
    isRemovingFromBookmarks
  } = useFavorites();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const deleteMutation = useDeleteRecipe();

  const { data: recipe, isLoading, error: queryError } = useRecipe(id!, {
    enabled: !deleteMutation.isPending && !deleteMutation.isSuccess,
  });

  if (isLoading) {
    return <Loading variant="spinner" size="lg" text="Crafting your recipe..." fullScreen />;
  }

  if (queryError || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
        <h2 className="text-2xl font-bold text-danger mb-2">
          {queryError ? "Oops! Something went wrong." : "Recipe Not Found"}
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-4 max-w-md">
          {queryError
            ? "We couldn't load the recipe. It might have been removed or the link is incorrect."
            : "Sorry, we couldn't find the recipe you're looking for."}
        </p>
        <Button onClick={() => navigate('/app/recipes')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to All Recipes
        </Button>
      </div>
    );
  }

  const canEdit = user?.id === recipe.authorId;

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    newChecked.has(index) ? newChecked.delete(index) : newChecked.add(index);
    setCheckedIngredients(newChecked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
        success('Recipe shared successfully!');
      } catch (shareError) {
        if (shareError instanceof Error && shareError.name !== 'AbortError') {
          error('Failed to share recipe.');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        success('Recipe link copied to clipboard!');
      } catch (clipboardError) {
        error('Failed to copy link.');
      }
    }
  };

  const handleDelete = () => setIsDeleteModalOpen(true);

  const confirmDelete = () => {
    deleteMutation.mutate(id!, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        navigate('/app/recipes', { replace: true });
        success('Recipe successfully deleted.');
      },
      onError: () => {
        error('Failed to delete recipe. Please try again.');
      }
    });
  };

  const getDifficultyVariant = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  const instructionsArray = recipe.instructions.split('\n').filter(Boolean);

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <div className="absolute top-24 left-4 z-20 print:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(-1)}
          className="w-fit"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end justify-center text-white text-center overflow-hidden">
        {recipe.imageUrl && (
          <div className="absolute inset-0">
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="absolute top-4 right-4 btn btn-ghost-white btn-sm z-10 print:hidden"
              aria-label="View full image"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="relative z-10 p-6 flex flex-col items-center animate-slide-up mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-pretty text-shadow-lg mb-4">
            {recipe.title}
          </h1>
          {recipe.description && (
            <p className="max-w-3xl text-lg text-white/90 text-shadow-md">
              {recipe.description}
            </p>
          )}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {/* Ingredients */}
            <Card className="card-enhanced p-6 sm:p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <ChefHat className="text-primary-500 w-8 h-8" />
                Ingredients
              </h2>
              <ul className="space-y-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    onClick={() => toggleIngredient(index)}
                    className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-secondary-100 dark:hover:bg-secondary-800"
                  >
                    <div className="flex-shrink-0">
                      {checkedIngredients.has(index) ? (
                        <CheckCircle className="w-6 h-6 text-primary-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-secondary-300 dark:text-secondary-600" />
                      )}
                    </div>
                    <span className={`flex-1 text-lg ${checkedIngredients.has(index) ? 'line-through text-secondary-500 dark:text-secondary-400' : ''}`}>
                      {ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Instructions */}
            <Card className="card-enhanced p-6 sm:p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <BarChart className="text-primary-500 w-8 h-8" />
                Instructions
              </h2>
              <ol className="space-y-6">
                {instructionsArray.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <p className="flex-1 text-lg leading-relaxed pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
            {/* Action Panel */}
            <Card className="card-enhanced p-6 print:hidden">
              <h3 className="text-xl font-bold mb-4">Actions</h3>
              <div className="flex flex-col gap-3">
                {isAuthenticated && (
                  <>
                    <Button
                      variant={isFavorited(recipe.id) ? "primary" : "outline"}
                      onClick={() => toggleFavorite(recipe.id, !!isFavorited(recipe.id))}
                      disabled={isAddingToFavorites || isRemovingFromFavorites}
                      leftIcon={<Heart className="w-4 h-4" />}
                    >
                      {isFavorited(recipe.id) ? "Favorited" : "Favorite"}
                    </Button>
                    <Button
                      variant={isBookmarked(recipe.id) ? "primary" : "outline"}
                      onClick={() => toggleBookmark(recipe.id, !!isBookmarked(recipe.id))}
                      disabled={isAddingToBookmarks || isRemovingFromBookmarks}
                      leftIcon={<Bookmark className="w-4 h-4" />}
                    >
                      {isBookmarked(recipe.id) ? "Bookmarked" : "Bookmark"}
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={handleShare} leftIcon={<Share2 className="w-4 h-4" />}>
                  Share
                </Button>
                {canEdit && (
                  <>
                    <hr className="border-secondary-200 dark:border-secondary-700 my-2" />
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/app/recipes/${id}/edit`)}
                      leftIcon={<Edit className="w-4 h-4" />}
                    >
                      Edit Recipe
                    </Button>
                    <Button
                      variant="danger-outline"
                      onClick={handleDelete}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Delete Recipe
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Meta Info */}
            <Card className="card-enhanced p-6">
              <h3 className="text-xl font-bold mb-4">Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400"><Clock className="w-5 h-5" /> Total Time</span>
                  <span className="font-bold">{formatCookTime((recipe.prepTime || 0) + (recipe.cookTime || 0))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400"><Users className="w-5 h-5" /> Servings</span>
                  <span className="font-bold">{recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}</span>
                </div>
                {recipe.cuisine && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400"><ChefHat className="w-5 h-5" /> Cuisine</span>
                    <span className="font-bold capitalize">{recipe.cuisine}</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400"><BarChart className="w-5 h-5" /> Difficulty</span>
                    <Badge variant={getDifficultyVariant(recipe.difficulty)}>{recipe.difficulty}</Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <Card className="card-enhanced p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary-500" /> Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Author */}
            {recipe.author && (
              <Card className="card-enhanced p-6">
                <h3 className="text-xl font-bold mb-4">Author</h3>
                <Link to={`/app/profile/${recipe.author?.id}`} className="flex items-center gap-3 group">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-secondary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 transition-transform group-hover:scale-110">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-lg group-hover:text-primary-500 transition-colors">{recipe.author?.name || recipe.author?.email}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 flex items-center gap-1">
                      View Profile <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </Link>
              </Card>
            )}
          </aside>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this recipe? This action cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            isLoading={deleteMutation.isPending}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>

      {recipe.imageUrl && (
        <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} size="xl">
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-auto object-contain rounded-lg max-h-[85vh]" />
        </Modal>
      )}
    </div>
  );
};

export default RecipeDetail;