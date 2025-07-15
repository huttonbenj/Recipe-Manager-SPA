/**
 * API-related type definitions
 */

// Import shared types
export type {
  ApiResponse,
  PaginationInfo,
  ApiError,
  UploadResponse
} from '@recipe-manager/shared-types'

// Import for use in interfaces below
import type { ApiError } from '@recipe-manager/shared-types'

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