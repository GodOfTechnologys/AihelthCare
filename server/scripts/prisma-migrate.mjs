import { execSync } from 'node:child_process';

const provider = process.env.SERVER_DB_PROVIDER || 'sqlite';
const name = process.argv[2] || 'init';
if (provider === 'postgres') {
  execSync(`npx prisma migrate dev --name ${name} --schema=prisma/schema.postgres.prisma`, { stdio: 'inherit' });
} else {
  execSync(`npx prisma migrate dev --name ${name} --schema=prisma/schema.prisma`, { stdio: 'inherit' });
}
