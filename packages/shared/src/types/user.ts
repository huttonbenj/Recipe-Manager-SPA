import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const UserCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

export const UserLoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string()
});

export type User = z.infer<typeof UserSchema>;
export type UserCredentials = z.infer<typeof UserCredentialsSchema>;
export type UserLoginResponse = z.infer<typeof UserLoginResponseSchema>; 