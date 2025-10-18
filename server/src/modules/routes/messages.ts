import { Router } from 'express';
import { prisma } from '../db/client';
import { toDbJson } from '../util/jsonCompat';
import { requireAuth } from '../middleware/auth';
import { generateAIResponse } from '../ai/engine';
import { Server as SocketIOServer } from 'socket.io';

const router = Router();

// We will inject io via app locals
function getIO(req: any): SocketIOServer | undefined {
  return req.app.get('io');
}

router.get('/', requireAuth, async (_req, res) => {
  const items = await prisma.message.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(items);
});

router.post('/', requireAuth, async (req, res) => {
  const { userId, content, language = 'en' } = req.body || {};
  if (!userId || !content) return res.status(400).json({ error: 'userId and content required' });

  const userMessage = await prisma.message.create({
    data: { userId, senderType: 'user', content, metadata: toDbJson({}) }
  });

  getIO(req)?.emit('message:new', userMessage);

  const ai = await generateAIResponse({ prompt: content, language });
  const botMessage = await prisma.message.create({
    data: { userId, senderType: 'bot', content: ai.text, metadata: toDbJson({ source: ai.source }) }
  });

  getIO(req)?.emit('message:new', botMessage);

  res.json({ userMessage, botMessage, source: ai.source });
});

export default router;
