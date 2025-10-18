import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { toDbJson } from '../src/modules/util/jsonCompat';

const prisma = new PrismaClient();

async function main() {
  const usersPath = path.join(__dirname, 'seed-data', 'users.json');
  const messagesPath = path.join(__dirname, 'seed-data', 'messages.json');
  const analyticsPath = path.join(__dirname, 'seed-data', 'analytics_logs.json');

  const usersRaw = JSON.parse(fs.readFileSync(usersPath, 'utf-8')) as any[];
  const messagesRaw = JSON.parse(fs.readFileSync(messagesPath, 'utf-8')) as any[];
  const analyticsRaw = JSON.parse(fs.readFileSync(analyticsPath, 'utf-8')) as any[];

  for (const u of usersRaw) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        languagePref: u.language_pref || 'en',
        settings: toDbJson(u.settings || {}),
        passwordHash: await bcrypt.hash('password123', 10)
      }
    });
  }

  for (const m of messagesRaw) {
    await prisma.message.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        userId: m.user_id,
        senderType: m.sender_type,
        content: m.content,
        createdAt: m.created_at ? new Date(m.created_at) : undefined
      }
    });
  }

  for (const a of analyticsRaw) {
    await prisma.analyticsLog.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        type: a.type,
        payload: toDbJson(a.payload),
        userId: a.user_id,
        createdAt: a.created_at ? new Date(a.created_at) : undefined
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
