import { Router } from 'express';
import { prisma } from '../db/client';
import { requireAuth } from '../middleware/auth';
import { Server as SocketIOServer } from 'socket.io';

const router = Router();

function getIO(req: any): SocketIOServer | undefined {
  return req.app.get('io');
}

router.get('/', requireAuth, async (req, res) => {
  const userId = Number((req as any).user.userId);
  const items = await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  res.json(items);
});

router.post('/', requireAuth, async (req, res) => {
  const { userId, title, body } = req.body || {};
  if (!userId || !title || !body) return res.status(400).json({ error: 'userId, title, body required' });
  const n = await prisma.notification.create({ data: { userId, title, body } });
  getIO(req)?.emit('notification:new', n);
  res.json(n);
});

router.post('/:id/read', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const n = await prisma.notification.update({ where: { id }, data: { read: true } });
  res.json(n);
});

export default router;
