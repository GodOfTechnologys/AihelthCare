import { execSync } from 'node:child_process';

const provider = process.env.SERVER_DB_PROVIDER || 'sqlite';
if (provider === 'postgres') {
  execSync('npx prisma migrate deploy --schema=prisma/schema.postgres.prisma', { stdio: 'inherit' });
} else {
  execSync('npx prisma migrate deploy --schema=prisma/schema.prisma', { stdio: 'inherit' });
}
