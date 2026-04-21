import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
  CORS_ORIGIN: string;
}

function validateEnv(): EnvConfig {
  const missing: string[] = [];

  if (!process.env.SUPABASE_URL) {
    missing.push('SUPABASE_URL');
  }

  if (!process.env.SUPABASE_ANON_KEY) {
    missing.push('SUPABASE_ANON_KEY');
  }

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;
  if (!geminiApiKey) {
    missing.push('GEMINI_API_KEY or GEMINI_KEY');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number.parseInt(process.env.PORT || '3001', 10),
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    GEMINI_API_KEY: geminiApiKey!,
    GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174',
  };
}

export const env = validateEnv();
