import { Router } from 'express';
import { prisma } from '../db/client';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  res.json(users);
});

router.get('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: 'not found' });
  res.json(user);
});

router.put('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { name, avatarUrl, languagePref, settings } = req.body || {};
  const updated = await prisma.user.update({
    where: { id },
    data: { name, avatarUrl, languagePref, settings }
  });
  res.json(updated);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
