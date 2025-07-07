import { z } from 'zod';

export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  details: z.record(z.unknown()).optional()
});

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative()
});

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown(),
  error: ApiErrorSchema.optional(),
  pagination: PaginationSchema.optional()
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type ApiResponse<T> = z.infer<typeof ApiResponseSchema> & {
  data: T;
}; 