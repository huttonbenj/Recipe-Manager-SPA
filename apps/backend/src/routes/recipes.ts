/**
 * Recipe routes
 * TODO: Implement recipe CRUD endpoints
 */

import { Router } from 'express'

const router = Router()

// GET /api/recipes
router.get('/', (req, res) => {
  res.json({ message: 'Get recipes endpoint - TODO: implement' })
})

// GET /api/recipes/:id
router.get('/:id', (req, res) => {
  res.json({ message: 'Get recipe by ID endpoint - TODO: implement' })
})

// POST /api/recipes
router.post('/', (req, res) => {
  res.json({ message: 'Create recipe endpoint - TODO: implement' })
})

// PUT /api/recipes/:id
router.put('/:id', (req, res) => {
  res.json({ message: 'Update recipe endpoint - TODO: implement' })
})

// DELETE /api/recipes/:id
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete recipe endpoint - TODO: implement' })
})

export default router