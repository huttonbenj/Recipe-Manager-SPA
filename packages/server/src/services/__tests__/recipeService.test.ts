import { RecipeService, CreateRecipeData, UpdateRecipeData } from '../recipeService';
import { db } from '../../config/database';
import { ApiError } from '../../middleware/error';

// Mock the database
jest.mock('../../config/database');
const mockDb = db as jest.Mocked<typeof db>;

describe('RecipeService', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockRecipeId = '456e7890-e89b-12d3-a456-426614174001';

  const mockClient = {
    query: jest.fn(),
    release: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.getClient.mockResolvedValue(mockClient as never);
    // Mock the client.query to return {rows: []} format (PostgreSQL client format)
    mockClient.query.mockResolvedValue({ rows: [] });
    // Mock db.query to return arrays directly (our wrapper returns result.rows)
    mockDb.query.mockResolvedValue([]);
  });

  describe('createRecipe', () => {
    const mockCreateData: CreateRecipeData = {
      title: 'Test Recipe',
      description: 'A test recipe',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: 'medium',
      cuisineType: 'Italian',
      ingredients: [
        { name: 'Tomatoes', amount: 2, unit: 'cups' },
        { name: 'Onions', amount: 1, unit: 'piece' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Chop tomatoes' },
        { stepNumber: 2, instruction: 'Cook onions' }
      ]
    };

    it('should handle database connection error', async () => {
      mockDb.getClient.mockRejectedValueOnce(new Error('Connection failed'));

      await expect(RecipeService.createRecipe(mockUserId, mockCreateData))
        .rejects.toThrow('Connection failed');
    });

    it('should create a recipe successfully', async () => {
      const mockRecipeRow = {
        id: mockRecipeId,
        user_id: mockUserId,
        title: mockCreateData.title,
        description: mockCreateData.description,
        prep_time_minutes: mockCreateData.prepTime,
        cook_time_minutes: mockCreateData.cookTime,
        servings: mockCreateData.servings,
        difficulty_level: mockCreateData.difficulty,
        cuisine_type: mockCreateData.cuisineType,
        created_at: new Date(),
        updated_at: new Date()
      };

      const mockIngredientRow1 = {
        id: 'ingredient-id-1',
        recipe_id: mockRecipeId,
        name: 'Tomatoes',
        amount: 2,
        unit: 'cups',
        notes: null,
        order_index: 0
      };

      const mockIngredientRow2 = {
        id: 'ingredient-id-2',
        recipe_id: mockRecipeId,
        name: 'Onions',
        amount: 1,
        unit: 'piece',
        notes: null,
        order_index: 1
      };

      const mockStepRow1 = {
        id: 'step-id-1',
        recipe_id: mockRecipeId,
        step_number: 1,
        instruction: 'Chop tomatoes',
        time_minutes: null,
        temperature: null
      };

      const mockStepRow2 = {
        id: 'step-id-2',
        recipe_id: mockRecipeId,
        step_number: 2,
        instruction: 'Cook onions',
        time_minutes: null,
        temperature: null
      };

      // Mock the sequence of queries
      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [mockRecipeRow] }) // Recipe insert
        .mockResolvedValueOnce({ rows: [mockIngredientRow1] }) // Ingredient 1 insert
        .mockResolvedValueOnce({ rows: [mockIngredientRow2] }) // Ingredient 2 insert
        .mockResolvedValueOnce({ rows: [mockStepRow1] }) // Step 1 insert
        .mockResolvedValueOnce({ rows: [mockStepRow2] }) // Step 2 insert
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const result = await RecipeService.createRecipe(mockUserId, mockCreateData);

      expect(result).toEqual({
        id: mockRecipeId,
        userId: mockUserId,
        title: mockCreateData.title,
        description: mockCreateData.description,
        prepTime: mockCreateData.prepTime,
        cookTime: mockCreateData.cookTime,
        servings: mockCreateData.servings,
        difficulty: mockCreateData.difficulty,
        cuisineType: mockCreateData.cuisineType,
        ingredients: [{
          id: 'ingredient-id-1',
          recipeId: mockRecipeId,
          name: 'Tomatoes',
          amount: 2,
          unit: 'cups',
          notes: null,
          orderIndex: 0
        }, {
          id: 'ingredient-id-2',
          recipeId: mockRecipeId,
          name: 'Onions',
          amount: 1,
          unit: 'piece',
          notes: null,
          orderIndex: 1
        }],
        steps: [{
          id: 'step-id-1',
          recipeId: mockRecipeId,
          stepNumber: 1,
          instruction: 'Chop tomatoes',
          timeMinutes: null,
          temperature: null
        }, {
          id: 'step-id-2',
          recipeId: mockRecipeId,
          stepNumber: 2,
          instruction: 'Cook onions',
          timeMinutes: null,
          temperature: null
        }],
        tags: [],
        createdAt: mockRecipeRow.created_at,
        updatedAt: mockRecipeRow.updated_at
      });
    });

    it('should rollback on error', async () => {
      (mockClient.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await expect(RecipeService.createRecipe(mockUserId, mockCreateData))
        .rejects.toThrow('Database error');

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should throw error for invalid ingredient', async () => {
      const mockRecipeRow = {
        id: mockRecipeId,
        user_id: mockUserId,
        title: mockCreateData.title,
        description: mockCreateData.description,
        prep_time_minutes: mockCreateData.prepTime,
        cook_time_minutes: mockCreateData.cookTime,
        servings: mockCreateData.servings,
        difficulty_level: mockCreateData.difficulty,
        cuisine_type: mockCreateData.cuisineType,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [mockRecipeRow] }); // Recipe insert

      const invalidData = {
        ...mockCreateData,
        ingredients: [null as unknown as typeof mockCreateData.ingredients[0], { name: 'Valid', amount: 1, unit: 'cup' }]
      };

      await expect(RecipeService.createRecipe(mockUserId, invalidData))
        .rejects.toThrow('Invalid ingredient at index 0');
    });

    it('should throw error for invalid step', async () => {
      const mockRecipeRow = {
        id: mockRecipeId,
        user_id: mockUserId,
        title: mockCreateData.title,
        description: mockCreateData.description,
        prep_time_minutes: mockCreateData.prepTime,
        cook_time_minutes: mockCreateData.cookTime,
        servings: mockCreateData.servings,
        difficulty_level: mockCreateData.difficulty,
        cuisine_type: mockCreateData.cuisineType,
        created_at: new Date(),
        updated_at: new Date()
      };

      const mockIngredientRow = {
        id: 'ingredient-id-1',
        recipe_id: mockRecipeId,
        name: 'Tomatoes',
        amount: 2,
        unit: 'cups',
        notes: null,
        order_index: 0
      };

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [mockRecipeRow] }) // Recipe insert
        .mockResolvedValueOnce({ rows: [mockIngredientRow] }) // Ingredient insert
        .mockResolvedValueOnce({ rows: [mockIngredientRow] }); // Second ingredient insert

      const invalidData = {
        ...mockCreateData,
        steps: [null as unknown as typeof mockCreateData.steps[0], { stepNumber: 2, instruction: 'Valid step' }]
      };

      await expect(RecipeService.createRecipe(mockUserId, invalidData))
        .rejects.toThrow('Invalid step at index 0');
    });
  });

  describe('getRecipeById', () => {
    it('should return a recipe when found', async () => {
      const mockRecipeRow = {
        id: mockRecipeId,
        user_id: mockUserId,
        title: 'Test Recipe',
        description: 'A test recipe',
        prep_time_minutes: 15,
        cook_time_minutes: 30,
        servings: 4,
        difficulty_level: 'medium',
        cuisine_type: 'Italian',
        created_at: new Date(),
        updated_at: new Date()
      };

      const mockIngredients = [
        { id: 'ing1', recipe_id: mockRecipeId, name: 'Tomatoes', amount: 2, unit: 'cups', notes: null, order_index: 0 }
      ];

      const mockSteps = [
        { id: 'step1', recipe_id: mockRecipeId, step_number: 1, instruction: 'Chop tomatoes', time_minutes: null, temperature: null }
      ];

      mockDb.query
        .mockResolvedValueOnce([mockRecipeRow])
        .mockResolvedValueOnce(mockIngredients)
        .mockResolvedValueOnce(mockSteps);

      const result = await RecipeService.getRecipeById(mockRecipeId);

      expect(result).toBeTruthy();
      expect(result!.title).toBe('Test Recipe');
      expect(result!.ingredients).toHaveLength(1);
      expect(result!.steps).toHaveLength(1);
    });

    it('should return null when recipe not found', async () => {
      mockDb.query.mockResolvedValueOnce([]);

      const result = await RecipeService.getRecipeById(mockRecipeId);

      expect(result).toBeNull();
    });

    it('should filter by user when userId provided', async () => {
      const mockRecipeRow = {
        id: mockRecipeId,
        user_id: mockUserId,
        title: 'Test Recipe',
        description: 'A test recipe',
        prep_time_minutes: 15,
        cook_time_minutes: 30,
        servings: 4,
        difficulty_level: 'medium',
        cuisine_type: 'Italian',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockDb.query
        .mockResolvedValueOnce([mockRecipeRow])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      await RecipeService.getRecipeById(mockRecipeId, mockUserId);

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('AND r.user_id = $2'),
        [mockRecipeId, mockUserId]
      );
    });
  });

  describe('getRecipes', () => {
    it('should return paginated recipes', async () => {
      const mockRecipeRow = {
        id: mockRecipeId,
        user_id: mockUserId,
        title: 'Test Recipe',
        description: 'A test recipe',
        prep_time_minutes: 15,
        cook_time_minutes: 30,
        servings: 4,
        difficulty_level: 'medium',
        cuisine_type: 'Italian',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockDb.query
        .mockResolvedValueOnce([{ total: '1' }]) // count query
        .mockResolvedValueOnce([mockRecipeRow]) // recipes query
        .mockResolvedValueOnce([]) // ingredients query
        .mockResolvedValueOnce([]); // steps query

      const result = await RecipeService.getRecipes({}, { page: 1, limit: 10 });

      expect(result.recipes).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.pages).toBe(1);
    });

    it('should apply filters correctly', async () => {
      mockDb.query
        .mockResolvedValueOnce([{ total: '0' }])
        .mockResolvedValueOnce([]);

      await RecipeService.getRecipes({
        difficulty: 'easy',
        cuisineType: 'Italian',
        maxPrepTime: 30,
        search: 'pasta'
      });

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE'),
        expect.arrayContaining(['easy', 'Italian', 30, '%pasta%'])
      );
    });

    it('should apply maxCookTime filter', async () => {
      mockDb.query
        .mockResolvedValueOnce([{ total: '0' }])
        .mockResolvedValueOnce([]);

      await RecipeService.getRecipes({
        maxCookTime: 45
      });

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE'),
        expect.arrayContaining([45])
      );
    });

    it('should apply userId filter', async () => {
      mockDb.query
        .mockResolvedValueOnce([{ total: '0' }])
        .mockResolvedValueOnce([]);

      await RecipeService.getRecipes({
        userId: mockUserId
      });

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE'),
        expect.arrayContaining([mockUserId])
      );
    });

    it('should throw error when count query fails', async () => {
      mockDb.query.mockResolvedValueOnce([]); // Empty result for count query

      await expect(RecipeService.getRecipes({}))
        .rejects.toThrow('Failed to get recipe count');
    });
  });

  describe('updateRecipe', () => {
    const mockUpdateData: UpdateRecipeData = {
      title: 'Updated Recipe',
      difficulty: 'hard'
    };

    it('should update a recipe successfully', async () => {
      const mockRecipe = {
        id: mockRecipeId,
        userId: mockUserId,
        title: 'Test Recipe',
        description: 'A test recipe',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'medium' as const,
        cuisineType: 'Italian',
        ingredients: [],
        steps: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock getRecipeById calls
      jest.spyOn(RecipeService, 'getRecipeById')
        .mockResolvedValueOnce(mockRecipe) // initial check
        .mockResolvedValueOnce({ ...mockRecipe, title: 'Updated Recipe', difficulty: 'hard' }); // final result

      const result = await RecipeService.updateRecipe(mockRecipeId, mockUserId, mockUpdateData);

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(result.title).toBe('Updated Recipe');
    });

    it('should throw error when recipe not found', async () => {
      jest.spyOn(RecipeService, 'getRecipeById').mockResolvedValueOnce(null);

      await expect(RecipeService.updateRecipe(mockRecipeId, mockUserId, mockUpdateData))
        .rejects.toThrow(ApiError);
    });

    it('should update ingredients when provided', async () => {
      const mockRecipe = {
        id: mockRecipeId,
        userId: mockUserId,
        title: 'Test Recipe',
        description: 'A test recipe',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'medium' as const,
        cuisineType: 'Italian',
        ingredients: [],
        steps: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(RecipeService, 'getRecipeById')
        .mockResolvedValueOnce(mockRecipe)
        .mockResolvedValueOnce(mockRecipe);

      const updateWithIngredients = {
        ingredients: [{ name: 'New Ingredient', amount: 1, unit: 'cup' }]
      };

      await RecipeService.updateRecipe(mockRecipeId, mockUserId, updateWithIngredients);

      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM recipe_ingredients WHERE recipe_id = $1',
        [mockRecipeId]
      );
    });

    it('should update all fields when provided', async () => {
      const mockRecipe = {
        id: mockRecipeId,
        userId: mockUserId,
        title: 'Test Recipe',
        description: 'A test recipe',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'medium' as const,
        cuisineType: 'Italian',
        ingredients: [],
        steps: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(RecipeService, 'getRecipeById')
        .mockResolvedValueOnce(mockRecipe)
        .mockResolvedValueOnce(mockRecipe);

      const completeUpdate = {
        title: 'New Title',
        description: 'New Description',
        prepTime: 25,
        cookTime: 45,
        servings: 6,
        difficulty: 'hard' as const,
        cuisineType: 'Mexican'
      };

      await RecipeService.updateRecipe(mockRecipeId, mockUserId, completeUpdate);

      // Should call update with all fields
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('title = $1'),
        expect.arrayContaining(['New Title', 'New Description', 25, 45, 6, 'hard', 'Mexican'])
      );
    });

    it('should update steps when provided', async () => {
      const mockRecipe = {
        id: mockRecipeId,
        userId: mockUserId,
        title: 'Test Recipe',
        description: 'A test recipe',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'medium' as const,
        cuisineType: 'Italian',
        ingredients: [],
        steps: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(RecipeService, 'getRecipeById')
        .mockResolvedValueOnce(mockRecipe)
        .mockResolvedValueOnce(mockRecipe);

      const updateWithSteps = {
        steps: [{ stepNumber: 1, instruction: 'New step', timeMinutes: 10, temperature: '350°F' }]
      };

      await RecipeService.updateRecipe(mockRecipeId, mockUserId, updateWithSteps);

      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM recipe_steps WHERE recipe_id = $1',
        [mockRecipeId]
      );
    });

    it('should handle partial updates with only some fields', async () => {
      const mockRecipe = {
        id: mockRecipeId,
        userId: mockUserId,
        title: 'Test Recipe',
        description: 'A test recipe',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'medium' as const,
        cuisineType: 'Italian',
        ingredients: [],
        steps: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(RecipeService, 'getRecipeById')
        .mockResolvedValueOnce(mockRecipe)
        .mockResolvedValueOnce(mockRecipe);

      // Test updating only prepTime and cuisineType to cover different conditional branches
      const partialUpdate = {
        prepTime: 20,
        cuisineType: 'French'
      };

      await RecipeService.updateRecipe(mockRecipeId, mockUserId, partialUpdate);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('prep_time_minutes = $1'),
        expect.arrayContaining([20, 'French'])
      );
    });

    it('should handle empty update object', async () => {
      const mockRecipe = {
        id: mockRecipeId,
        userId: mockUserId,
        title: 'Test Recipe',
        description: 'A test recipe',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'medium' as const,
        cuisineType: 'Italian',
        ingredients: [],
        steps: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(RecipeService, 'getRecipeById')
        .mockResolvedValueOnce(mockRecipe)
        .mockResolvedValueOnce(mockRecipe);

      // Test with empty update to cover the case where no fields are updated
      const emptyUpdate = {};

      await RecipeService.updateRecipe(mockRecipeId, mockUserId, emptyUpdate);

      // Should still work but not update any fields
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe successfully', async () => {
      const mockRecipe = {
        id: mockRecipeId,
        userId: mockUserId,
        title: 'Test Recipe',
        description: 'A test recipe',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'medium' as const,
        cuisineType: 'Italian',
        ingredients: [],
        steps: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(RecipeService, 'getRecipeById').mockResolvedValueOnce(mockRecipe);

      await RecipeService.deleteRecipe(mockRecipeId, mockUserId);

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM recipes WHERE id = $1 AND user_id = $2',
        [mockRecipeId, mockUserId]
      );
    });

    it('should throw error when recipe not found', async () => {
      jest.spyOn(RecipeService, 'getRecipeById').mockResolvedValueOnce(null);

      await expect(RecipeService.deleteRecipe(mockRecipeId, mockUserId))
        .rejects.toThrow(ApiError);
    });
  });
}); 