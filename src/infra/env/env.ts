import { z } from 'zod';
import { stringToJSONSchema } from '../http/pipes/string-to-json';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  GOOGLE_DRIVE_CLIENT_ID: z.string(),
  GOOGLE_DRIVE_CLIENT_SECRET: z.string(),
  GOOGLE_DRIVE_REDIRECT_URI: z.string().url().default('http://localhost:3000/auth/google/callback'),
  GOOGLE_DRIVE_REFRESH_TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;
