/**
 * API-related type definitions
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

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}

// Generic hook return types
export interface QueryResult<T> {
  data: T | undefined
  isLoading: boolean
  isError: boolean
  error: ApiError | null
  refetch: () => void
}

export interface MutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => void
  mutateAsync: (variables: TVariables) => Promise<TData>
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  error: ApiError | null
  data: TData | undefined
  reset: () => void
}