import dotenv from 'dotenv';
dotenv.config();

export type Env = {
  NODE_ENV: string;
  PORT: string;
  ALLOWED_ORIGIN: string;
  USE_CLOUD: string;
  SERVER_DB_PROVIDER: 'sqlite' | 'postgres';
  DATABASE_URL: string;
  OPENAI_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  S3_ENDPOINT?: string;
  S3_REGION?: string;
  S3_BUCKET?: string;
  S3_ACCESS_KEY_ID?: string;
  S3_SECRET_ACCESS_KEY?: string;
  JWT_SECRET: string;
};

export function getEnv(): Env {
  const env: Env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '5000',
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    USE_CLOUD: process.env.USE_CLOUD || 'false',
    SERVER_DB_PROVIDER: (process.env.SERVER_DB_PROVIDER as 'sqlite' | 'postgres') || 'sqlite',
    DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_REGION: process.env.S3_REGION || 'us-east-1',
    S3_BUCKET: process.env.S3_BUCKET || 'globalsmarthub',
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me'
  };
  return env;
}
