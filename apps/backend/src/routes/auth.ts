/**
 * Authentication routes
 * TODO: Implement auth endpoints (login, register, logout, refresh)
 */

import { Router } from 'express'

const router = Router()

// POST /api/auth/login
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - TODO: implement' })
})

// POST /api/auth/register
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - TODO: implement' })
})

// DELETE /api/auth/logout
router.delete('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint - TODO: implement' })
})

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  res.json({ message: 'Refresh token endpoint - TODO: implement' })
})

export default router