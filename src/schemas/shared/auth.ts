import { z } from 'zod';

const usernameField = z.string().min(1, 'Username must be a non-empty string');
const passwordField = z.string().min(1, 'Password must be a non-empty string');
export const emailField = z.email('Invalid email format');

export const CookieResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  access_token_expiration: z.number(),
  refresh_token_expiration: z.number(),
});

export const CreateUserSchema = z.object({
  username: usernameField,
  password: passwordField,
  email: emailField,
});

const LoginUsernameSchema = z.object({
  type: z.literal('username'),
  username: usernameField,
  password: passwordField,
});

const LoginEmailSchema = z.object({
  type: z.literal('email'),
  email: emailField,
  password: passwordField,
});

export const LoginUserSchema = z.discriminatedUnion('type', [
  LoginUsernameSchema,
  LoginEmailSchema,
]);

export type EmailInput = z.infer<typeof emailField>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type CookieResponse = z.infer<typeof CookieResponseSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;
