/**
 * Upload routes
 * TODO: Implement file upload endpoints
 */

import { Router } from 'express'

const router = Router()

// POST /api/upload/image
router.post('/image', (req, res) => {
  res.json({ message: 'Image upload endpoint - TODO: implement' })
})

export default router