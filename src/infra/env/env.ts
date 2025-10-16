import { z } from 'zod';
import { stringToJSONSchema } from '../http/pipes/string-to-json';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  GOOGLE_DRIVE_CLIENT_ID: z.string(),
  GOOGLE_DRIVE_CLIENT_SECRET: z.string(),
  GOOGLE_DRIVE_REDIRECT_URI: z.string().url().default('http://localhost:3000/auth/google/callback'),
  GOOGLE_DRIVE_REFRESH_TOKEN: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  EMAIL_USER: z.string().email(),
  EMAIL_CLIENT_ID: z.string(),
  EMAIL_CLIENT_SECRET: z.string(),
  EMAIL_REFRESH_TOKEN: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
