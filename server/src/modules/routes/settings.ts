import { Router } from 'express';
import { prisma } from '../db/client';
import { fromDbJson, toDbJson } from '../util/jsonCompat';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/:userId', requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'not found' });
  const settings = fromDbJson<Record<string, any>>(user.settings) || {};
  res.json(settings);
});

router.put('/:userId', requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  const settings = req.body || {};
  const updated = await prisma.user.update({ where: { id: userId }, data: { settings: toDbJson(settings) } });
  const result = fromDbJson<Record<string, any>>(updated.settings) || {};
  res.json(result);
});

export default router;
