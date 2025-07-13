/**
 * Shared API types
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: Record<string, any>
}