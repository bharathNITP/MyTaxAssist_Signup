import { z } from 'zod';

export const registerEmailSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email('Invalid email format')
      .max(255, 'Email must not exceed 255 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must not exceed 128 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const googleSignInSchema = z.object({
  idToken: z
    .string()
    .min(1, 'idToken is required')
    .max(4096, 'idToken is too long'),
});

export type RegisterEmailInput = z.infer<typeof registerEmailSchema>;
export type GoogleSignInInput = z.infer<typeof googleSignInSchema>;
