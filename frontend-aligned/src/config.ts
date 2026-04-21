const REQUIRED_IN_PRODUCTION = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_AI_API_KEY',
] as const;

const readEnv = () => ({
  VITE_API_URL: import.meta.env.VITE_API_URL as string | undefined,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  VITE_AI_API_KEY: import.meta.env.VITE_AI_API_KEY as string | undefined,
});

const env = readEnv();

if (import.meta.env.PROD) {
  const missingKeys = REQUIRED_IN_PRODUCTION.filter(
    (key) => {
      const value = env[key];
      return !value || String(value).trim().length === 0;
    }
  );

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${missingKeys.join(', ')}`
    );
  }
}

export const config = {
  apiBaseUrl: env.VITE_API_URL || 'http://localhost:3001/api',
  supabaseUrl: env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY || '',
  aiApiKey: env.VITE_AI_API_KEY || '',
};
