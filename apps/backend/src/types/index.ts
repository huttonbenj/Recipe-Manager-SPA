/**
 * Backend type definitions
 * TODO: Implement backend-specific types
 */

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export interface RequestWithUser extends Request {
  user?: {
    id: string
    email: string
  }
}