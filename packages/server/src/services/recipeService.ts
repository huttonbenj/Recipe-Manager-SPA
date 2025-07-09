import { Recipe, RecipeIngredient, RecipeStep } from '@recipe-manager/shared';
import { db } from '../config/database';
import { ApiError } from '../middleware/error';
import { QueryResultRow } from 'pg';

export interface CreateRecipeData {
  title: string;
  description?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisineType?: string;
  ingredients: Omit<RecipeIngredient, 'id' | 'recipeId'>[];
  steps: Omit<RecipeStep, 'id' | 'recipeId'>[];
}

export interface UpdateRecipeData {
  title?: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisineType?: string;
  ingredients?: Omit<RecipeIngredient, 'id' | 'recipeId'>[];
  steps?: Omit<RecipeStep, 'id' | 'recipeId'>[];
}

export interface RecipeFilters {
  userId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisineType?: string;
  maxPrepTime?: number;
  maxCookTime?: number;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedRecipes {
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class RecipeService {
  static async createRecipe(userId: string, recipeData: CreateRecipeData): Promise<Recipe> {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');

      // Insert recipe
      const recipeQuery = `
        INSERT INTO recipes (user_id, title, description, prep_time_minutes, cook_time_minutes, servings, difficulty_level, cuisine_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, user_id, title, description, prep_time_minutes, cook_time_minutes, servings, difficulty_level, cuisine_type, created_at, updated_at
      `;
      
      const recipeResult = await client.query(recipeQuery, [
        userId,
        recipeData.title,
        recipeData.description || null,
        recipeData.prepTime,
        recipeData.cookTime,
        recipeData.servings,
        recipeData.difficulty || null,
        recipeData.cuisineType || null
      ]);

      const recipe = recipeResult.rows[0];

      if (!recipe) {
        throw new ApiError(500, 'Failed to create recipe');
      }

      // Insert ingredients
      const ingredients: RecipeIngredient[] = [];
      for (let i = 0; i < recipeData.ingredients.length; i++) {
        const ingredient = recipeData.ingredients[i];
        if (!ingredient) {
          throw new ApiError(400, `Invalid ingredient at index ${i}`);
        }
        
        const ingredientQuery = `
          INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, notes, order_index)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, recipe_id, name, amount, unit, notes, order_index
        `;
        
        const ingredientResult = await client.query(ingredientQuery, [
          recipe.id,
          ingredient.name,
          ingredient.amount || null,
          ingredient.unit || null,
          ingredient.notes || null,
          ingredient.orderIndex || i
        ]);
        
        const dbIngredient = ingredientResult.rows[0];
        ingredients.push({
          id: dbIngredient.id,
          recipeId: dbIngredient.recipe_id,
          name: dbIngredient.name,
          amount: dbIngredient.amount,
          unit: dbIngredient.unit,
          notes: dbIngredient.notes,
          orderIndex: dbIngredient.order_index
        });
      }

      // Insert steps
      const steps: RecipeStep[] = [];
      for (let i = 0; i < recipeData.steps.length; i++) {
        const step = recipeData.steps[i];
        if (!step) {
          throw new ApiError(400, `Invalid step at index ${i}`);
        }
        
        const stepQuery = `
          INSERT INTO recipe_steps (recipe_id, step_number, instruction, time_minutes, temperature)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, recipe_id, step_number, instruction, time_minutes, temperature
        `;
        
        const stepResult = await client.query(stepQuery, [
          recipe.id,
          step.stepNumber || (i + 1),
          step.instruction,
          step.timeMinutes || null,
          step.temperature || null
        ]);
        
        const dbStep = stepResult.rows[0];
        steps.push({
          id: dbStep.id,
          recipeId: dbStep.recipe_id,
          stepNumber: dbStep.step_number,
          instruction: dbStep.instruction,
          timeMinutes: dbStep.time_minutes,
          temperature: dbStep.temperature
        });
      }

      await client.query('COMMIT');

      return {
        id: recipe.id,
        userId: recipe.user_id,
        title: recipe.title,
        description: recipe.description,
        prepTime: recipe.prep_time_minutes,
        cookTime: recipe.cook_time_minutes,
        servings: recipe.servings,
        difficulty: recipe.difficulty_level,
        cuisineType: recipe.cuisine_type,
        ingredients,
        steps,
        tags: [],
        createdAt: recipe.created_at,
        updatedAt: recipe.updated_at
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getRecipeById(id: string, userId?: string): Promise<Recipe | null> {
    const query = `
      SELECT r.id, r.user_id, r.title, r.description, r.prep_time_minutes, r.cook_time_minutes, 
             r.servings, r.difficulty_level, r.cuisine_type, r.created_at, r.updated_at
      FROM recipes r
      WHERE r.id = $1 ${userId ? 'AND r.user_id = $2' : ''}
    `;
    
    const params = userId ? [id, userId] : [id];
    const result = await db.query(query, params);
    
    if (result.length === 0) {
      return null;
    }

    const recipe = result[0];
    
    // Get ingredients
    const ingredientsQuery = `
      SELECT id, recipe_id, name, amount, unit, notes, order_index
      FROM recipe_ingredients
      WHERE recipe_id = $1
      ORDER BY order_index, id
    `;
    const ingredientsResult = await db.query(ingredientsQuery, [id]);

    // Get steps
    const stepsQuery = `
      SELECT id, recipe_id, step_number, instruction, time_minutes, temperature
      FROM recipe_steps
      WHERE recipe_id = $1
      ORDER BY step_number
    `;
    const stepsResult = await db.query(stepsQuery, [id]);

    const ingredients = ingredientsResult.map((row: QueryResultRow): RecipeIngredient => ({
      id: row.id as string,
      recipeId: row.recipe_id as string,
      name: row.name as string,
      amount: row.amount as number,
      unit: row.unit as string,
      notes: row.notes as string,
      orderIndex: row.order_index as number
    }));

    const steps = stepsResult.map((row: QueryResultRow): RecipeStep => ({
      id: row.id as string,
      recipeId: row.recipe_id as string,
      stepNumber: row.step_number as number,
      instruction: row.instruction as string,
      timeMinutes: row.time_minutes as number,
      temperature: row.temperature as string
    }));

    if (!recipe) {
      return null;
    }

    return {
      id: recipe.id,
      userId: recipe.user_id,
      title: recipe.title,
      description: recipe.description,
      prepTime: recipe.prep_time_minutes,
      cookTime: recipe.cook_time_minutes,
      servings: recipe.servings,
      difficulty: recipe.difficulty_level,
      cuisineType: recipe.cuisine_type,
      ingredients,
      steps,
      tags: [],
      createdAt: recipe.created_at,
      updatedAt: recipe.updated_at
    };
  }

  static async getRecipes(
    filters: RecipeFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedRecipes> {
    const offset = (pagination.page - 1) * pagination.limit;
    
    const whereConditions: string[] = [];
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    if (filters.userId) {
      whereConditions.push(`r.user_id = $${paramIndex}`);
      queryParams.push(filters.userId);
      paramIndex++;
    }

    if (filters.difficulty) {
      whereConditions.push(`r.difficulty_level = $${paramIndex}`);
      queryParams.push(filters.difficulty);
      paramIndex++;
    }

    if (filters.cuisineType) {
      whereConditions.push(`r.cuisine_type = $${paramIndex}`);
      queryParams.push(filters.cuisineType);
      paramIndex++;
    }

    if (filters.maxPrepTime) {
      whereConditions.push(`r.prep_time_minutes <= $${paramIndex}`);
      queryParams.push(filters.maxPrepTime);
      paramIndex++;
    }

    if (filters.maxCookTime) {
      whereConditions.push(`r.cook_time_minutes <= $${paramIndex}`);
      queryParams.push(filters.maxCookTime);
      paramIndex++;
    }

    if (filters.search) {
      whereConditions.push(`(r.title ILIKE $${paramIndex} OR r.description ILIKE $${paramIndex})`);
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM recipes r
      ${whereClause}
    `;
    const countResult = await db.query(countQuery, queryParams);
    const countRow = countResult[0];
    if (!countRow) {
      throw new ApiError(500, 'Failed to get recipe count');
    }
    const total = parseInt(countRow.total);

    // Get recipes
    const recipesQuery = `
      SELECT r.id, r.user_id, r.title, r.description, r.prep_time_minutes, r.cook_time_minutes,
             r.servings, r.difficulty_level, r.cuisine_type, r.created_at, r.updated_at
      FROM recipes r
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    queryParams.push(pagination.limit, offset);
    const recipesResult = await db.query(recipesQuery, queryParams);

    const recipes: Recipe[] = [];
    
    for (const recipeRow of recipesResult) {
      // Get ingredients for each recipe
      const ingredientsQuery = `
        SELECT id, recipe_id, name, amount, unit, notes, order_index
        FROM recipe_ingredients
        WHERE recipe_id = $1
        ORDER BY order_index, id
      `;
      const ingredientsResult = await db.query(ingredientsQuery, [recipeRow.id]);

      // Get steps for each recipe
      const stepsQuery = `
        SELECT id, recipe_id, step_number, instruction, time_minutes, temperature
        FROM recipe_steps
        WHERE recipe_id = $1
        ORDER BY step_number
      `;
      const stepsResult = await db.query(stepsQuery, [recipeRow.id]);

      const ingredients = ingredientsResult.map((row: QueryResultRow): RecipeIngredient => ({
        id: row.id as string,
        recipeId: row.recipe_id as string,
        name: row.name as string,
        amount: row.amount as number,
        unit: row.unit as string,
        notes: row.notes as string,
        orderIndex: row.order_index as number
      }));

      const steps = stepsResult.map((row: QueryResultRow): RecipeStep => ({
        id: row.id as string,
        recipeId: row.recipe_id as string,
        stepNumber: row.step_number as number,
        instruction: row.instruction as string,
        timeMinutes: row.time_minutes as number,
        temperature: row.temperature as string
      }));

      recipes.push({
        id: recipeRow.id,
        userId: recipeRow.user_id,
        title: recipeRow.title,
        description: recipeRow.description,
        prepTime: recipeRow.prep_time_minutes,
        cookTime: recipeRow.cook_time_minutes,
        servings: recipeRow.servings,
        difficulty: recipeRow.difficulty_level,
        cuisineType: recipeRow.cuisine_type,
        ingredients,
        steps,
        tags: [],
        createdAt: recipeRow.created_at,
        updatedAt: recipeRow.updated_at
      });
    }

    return {
      recipes,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      }
    };
  }

  static async updateRecipe(id: string, userId: string, updateData: UpdateRecipeData): Promise<Recipe> {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');

      // Check if recipe exists and belongs to user
      const existingRecipe = await this.getRecipeById(id, userId);
      if (!existingRecipe) {
        throw new ApiError(404, 'Recipe not found');
      }

      // Update recipe basic info
      const updateFields: string[] = [];
      const updateParams: (string | number)[] = [];
      let paramIndex = 1;

      if (updateData.title !== undefined) {
        updateFields.push(`title = $${paramIndex}`);
        updateParams.push(updateData.title);
        paramIndex++;
      }

      if (updateData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateParams.push(updateData.description);
        paramIndex++;
      }

      if (updateData.prepTime !== undefined) {
        updateFields.push(`prep_time_minutes = $${paramIndex}`);
        updateParams.push(updateData.prepTime);
        paramIndex++;
      }

      if (updateData.cookTime !== undefined) {
        updateFields.push(`cook_time_minutes = $${paramIndex}`);
        updateParams.push(updateData.cookTime);
        paramIndex++;
      }

      if (updateData.servings !== undefined) {
        updateFields.push(`servings = $${paramIndex}`);
        updateParams.push(updateData.servings);
        paramIndex++;
      }

      if (updateData.difficulty !== undefined) {
        updateFields.push(`difficulty_level = $${paramIndex}`);
        updateParams.push(updateData.difficulty);
        paramIndex++;
      }

      if (updateData.cuisineType !== undefined) {
        updateFields.push(`cuisine_type = $${paramIndex}`);
        updateParams.push(updateData.cuisineType);
        paramIndex++;
      }

      if (updateFields.length > 0) {
        updateFields.push(`updated_at = NOW()`);
        updateParams.push(id, userId);
        
        const updateQuery = `
          UPDATE recipes 
          SET ${updateFields.join(', ')}
          WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
        `;
        
        await client.query(updateQuery, updateParams);
      }

      // Update ingredients if provided
      if (updateData.ingredients !== undefined) {
        // Delete existing ingredients
        await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [id]);
        
        // Insert new ingredients
        for (let i = 0; i < updateData.ingredients.length; i++) {
          const ingredient = updateData.ingredients[i];
          if (!ingredient) {
            throw new ApiError(400, `Invalid ingredient at index ${i}`);
          }
          
          const ingredientQuery = `
            INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, notes, order_index)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;
          
          await client.query(ingredientQuery, [
            id,
            ingredient.name,
            ingredient.amount || null,
            ingredient.unit || null,
            ingredient.notes || null,
            ingredient.orderIndex || i
          ]);
        }
      }

      // Update steps if provided
      if (updateData.steps !== undefined) {
        // Delete existing steps
        await client.query('DELETE FROM recipe_steps WHERE recipe_id = $1', [id]);
        
        // Insert new steps
        for (let i = 0; i < updateData.steps.length; i++) {
          const step = updateData.steps[i];
          if (!step) {
            throw new ApiError(400, `Invalid step at index ${i}`);
          }
          
          const stepQuery = `
            INSERT INTO recipe_steps (recipe_id, step_number, instruction, time_minutes, temperature)
            VALUES ($1, $2, $3, $4, $5)
          `;
          
          await client.query(stepQuery, [
            id, 
            step.stepNumber || (i + 1), 
            step.instruction,
            step.timeMinutes || null,
            step.temperature || null
          ]);
        }
      }

      await client.query('COMMIT');

      // Return updated recipe
      const updatedRecipe = await this.getRecipeById(id, userId);
      if (!updatedRecipe) {
        throw new ApiError(500, 'Failed to retrieve updated recipe');
      }

      return updatedRecipe;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteRecipe(id: string, userId: string): Promise<void> {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');

      // Check if recipe exists and belongs to user
      const existingRecipe = await this.getRecipeById(id, userId);
      if (!existingRecipe) {
        throw new ApiError(404, 'Recipe not found');
      }

      // Delete ingredients and steps (will cascade)
      await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [id]);
      await client.query('DELETE FROM recipe_steps WHERE recipe_id = $1', [id]);
      
      // Delete recipe
      await client.query('DELETE FROM recipes WHERE id = $1 AND user_id = $2', [id, userId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
} 