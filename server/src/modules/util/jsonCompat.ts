import { getEnv } from '../config/env';

export function toDbJson<T>(value: T): any {
  const provider = getEnv().SERVER_DB_PROVIDER;
  if (provider === 'postgres') return value as any;
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return JSON.stringify(null);
  }
}

export function fromDbJson<T>(value: any): T | null {
  const provider = getEnv().SERVER_DB_PROVIDER;
  if (provider === 'postgres') return (value as T) ?? null;
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
