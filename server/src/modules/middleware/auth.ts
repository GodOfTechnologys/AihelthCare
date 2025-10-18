import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../auth/jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const [, token] = auth.split(' ');
  try {
    const payload = verifyJwt(token);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
