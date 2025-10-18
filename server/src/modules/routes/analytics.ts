import { Router } from 'express';
import { prisma } from '../db/client';
import { toDbJson } from '../util/jsonCompat';
import { requireAuth } from '../middleware/auth';
import { Server as SocketIOServer } from 'socket.io';

const router = Router();

function getIO(req: any): SocketIOServer | undefined {
  return req.app.get('io');
}

router.get('/metrics', requireAuth, async (_req, res) => {
  const messageCount = await prisma.message.count();
  const usersCount = await prisma.user.count();
  const last10 = await prisma.analyticsLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
  res.json({ messageCount, usersCount, last10 });
});

router.post('/log', requireAuth, async (req, res) => {
  const { type, payload, userId } = req.body || {};
  if (!type || payload == null) return res.status(400).json({ error: 'type and payload required' });
  const log = await prisma.analyticsLog.create({ data: { type, payload: toDbJson(payload), userId } });
  getIO(req)?.emit('analytics:update', log);
  res.json(log);
});

export default router;
