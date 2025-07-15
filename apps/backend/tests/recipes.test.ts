/**
 * Recipe API Tests
 * Critical tests for recipe CRUD operations
 */

import request from 'supertest'
import app from '../src/app'
import { createTestUser, createTestRecipe, getRecipeById, getAllRecipes, prisma } from './setup'
import bcrypt from 'bcryptjs'

describe('Recipe API', () => {
  let authToken: string
  let userId: string
  let otherUserId: string

  beforeEach(async () => {
    // Create test user and get auth token
    const hashedPassword = await bcrypt.hash('password123', 10)
    const user = await createTestUser({
      email: 'recipe-test@example.com',
      name: 'Recipe Test User',
      password: hashedPassword
    })
    userId = user.id

    // Create another user for ownership tests
    const otherUser = await createTestUser({
      email: 'other@example.com',
      name: 'Other User',
      password: hashedPassword
    })
    otherUserId = otherUser.id

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'recipe-test@example.com',
        password: 'password123'
      })

    authToken = loginRes.body.data.accessToken
  })

  describe('GET /recipes', () => {
    beforeEach(async () => {
      // Create test recipes
      await createTestRecipe({
        title: 'Delicious Pasta',
        authorId: userId,
        description: 'A wonderful pasta dish',
        ingredients: ['pasta', 'tomatoes', 'cheese'],
        instructions: ['Cook pasta', 'Add sauce', 'Enjoy!'],
        tags: ['italian', 'pasta'],
        cuisine: 'Italian',
        difficulty: 'EASY',
        cookTime: 20,
        prepTime: 10,
        servings: 4
      })

      await createTestRecipe({
        title: 'Spicy Tacos',
        authorId: otherUserId,
        description: 'Mexican tacos with a kick',
        ingredients: ['tortillas', 'beef', 'spices'],
        instructions: ['Cook beef', 'Season', 'Assemble tacos'],
        tags: ['mexican', 'spicy'],
        cuisine: 'Mexican',
        difficulty: 'MEDIUM',
        cookTime: 15,
        prepTime: 20,
        servings: 6
      })
    })

    it('should return all recipes', async () => {
      const res = await request(app)
        .get('/api/recipes')

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('recipes')
      expect(Array.isArray(res.body.recipes)).toBe(true)
      expect(res.body.recipes.length).toBe(2)
    })

    it('should search recipes by title', async () => {
      const res = await request(app)
        .get('/api/recipes?search=Pasta')

      expect(res.status).toBe(200)
      expect(res.body.recipes.length).toBe(1)
      expect(res.body.recipes[0].title).toContain('Pasta')
    })

    it('should filter recipes by tags', async () => {
      const res = await request(app)
        .get('/api/recipes?tags=italian')

      expect(res.status).toBe(200)
      expect(res.body.recipes.length).toBe(1)
      expect(res.body.recipes[0].title).toContain('Pasta')
    })

    it('should filter recipes by cuisine', async () => {
      const res = await request(app)
        .get('/api/recipes?cuisine=Mexican')

      expect(res.status).toBe(200)
      expect(res.body.recipes.length).toBe(1)
      expect(res.body.recipes[0].title).toContain('Tacos')
    })

    it('should filter recipes by difficulty', async () => {
      const res = await request(app)
        .get('/api/recipes?difficulty=EASY')

      expect(res.status).toBe(200)
      expect(res.body.recipes.length).toBe(1)
      expect(res.body.recipes[0].difficulty).toBe('EASY')
    })

    it('should return empty array when no recipes match search', async () => {
      const res = await request(app)
        .get('/api/recipes?search=NonExistentRecipe')

      expect(res.status).toBe(200)
      expect(res.body.recipes.length).toBe(0)
    })
  })

  describe('GET /recipes/:id', () => {
    let recipeId: string

    beforeEach(async () => {
      recipeId = await createTestRecipe({
        title: 'Test Recipe',
        authorId: userId,
        description: 'A test recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: ['step1', 'step2']
      })
    })

    it('should return recipe by ID', async () => {
      const res = await request(app)
        .get(`/api/recipes/${recipeId}`)

      expect(res.status).toBe(200)
      expect(res.body.data.recipe).toHaveProperty('id', recipeId)
      expect(res.body.data.recipe).toHaveProperty('title', 'Test Recipe')
      expect(res.body.data.recipe).toHaveProperty('author')
    })

    it('should return 404 for non-existent recipe', async () => {
      const res = await request(app)
        .get('/api/recipes/non-existent-id')

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('error')
    })
  })

  describe('POST /recipes', () => {
    const validRecipe = {
      title: 'New Recipe',
      description: 'A new test recipe',
      ingredients: ['ingredient1', 'ingredient2'],
      instructions: 'Step 1: Do this. Step 2: Do that.',
      tags: ['test'],
      cuisine: 'Test Cuisine',
      difficulty: 'MEDIUM',
      cookTime: 30,
      prepTime: 15,
      servings: 4
    }

    it('should create recipe with authentication', async () => {
      const res = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validRecipe)

      expect(res.status).toBe(201)
      expect(res.body.data.recipe).toHaveProperty('id')
      expect(res.body.data.recipe.title).toBe(validRecipe.title)
      expect(res.body.data.recipe.authorId).toBe(userId)

      // Verify in database
      const dbRecipe = await getRecipeById(res.body.data.recipe.id)
      expect(dbRecipe).toBeTruthy()
    })

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/recipes')
        .send(validRecipe)

      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('error')
    })

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
    })

    it('should validate ingredients array', async () => {
      const res = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validRecipe,
          ingredients: 'not an array'
        })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
    })

    it('should validate difficulty enum', async () => {
      const res = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validRecipe,
          difficulty: 'INVALID'
        })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
    })
  })

  describe('PUT /recipes/:id', () => {
    let recipeId: string
    let otherRecipeId: string

    beforeEach(async () => {
      recipeId = await createTestRecipe({
        title: 'Original Recipe',
        authorId: userId,
        description: 'Original description'
      })

      otherRecipeId = await createTestRecipe({
        title: 'Other User Recipe',
        authorId: otherUserId,
        description: 'Other user description'
      })
    })

    it('should update own recipe successfully', async () => {
      const updateData = {
        title: 'Updated Recipe',
        description: 'Updated description',
        cookTime: 45
      }

      const res = await request(app)
        .put(`/api/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)

      expect(res.status).toBe(200)
      expect(res.body.data.recipe.title).toBe(updateData.title)
      expect(res.body.data.recipe.description).toBe(updateData.description)
      expect(res.body.data.recipe.cookTime).toBe(updateData.cookTime)
    })

    it('should reject updating other user recipe', async () => {
      const updateData = {
        title: 'Unauthorized Update'
      }

      const res = await request(app)
        .put(`/api/recipes/${otherRecipeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)

      expect(res.status).toBe(403)
      expect(res.body).toHaveProperty('error')
    })

    it('should require authentication', async () => {
      const res = await request(app)
        .put(`/api/recipes/${recipeId}`)
        .send({ title: 'Update' })

      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('error')
    })

    it('should return 404 for non-existent recipe', async () => {
      const res = await request(app)
        .put('/api/recipes/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Update' })

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('error')
    })
  })

  describe('DELETE /recipes/:id', () => {
    let recipeId: string
    let otherRecipeId: string

    beforeEach(async () => {
      recipeId = await createTestRecipe({
        title: 'Recipe to Delete',
        authorId: userId
      })

      otherRecipeId = await createTestRecipe({
        title: 'Other User Recipe',
        authorId: otherUserId
      })
    })

    it('should delete own recipe successfully', async () => {
      const res = await request(app)
        .delete(`/api/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('message')

      // Verify deletion in database
      const deletedRecipe = await getRecipeById(recipeId)
      expect(deletedRecipe).toBeFalsy()
    })

    it('should reject deleting other user recipe', async () => {
      const res = await request(app)
        .delete(`/api/recipes/${otherRecipeId}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(403)
      expect(res.body).toHaveProperty('error')

      // Verify recipe still exists
      const recipe = await getRecipeById(otherRecipeId)
      expect(recipe).toBeTruthy()
    })

    it('should require authentication', async () => {
      const res = await request(app)
        .delete(`/api/recipes/${recipeId}`)

      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('error')
    })

    it('should return 404 for non-existent recipe', async () => {
      const res = await request(app)
        .delete('/api/recipes/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('error')
    })
  })
}) 