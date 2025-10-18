import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../middleware/auth';

// Store uploads at /server/uploads so express static can serve them
const uploadsDir = path.join(__dirname, '..', '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

const router = Router();

router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  const file = (req as any).file as Express.Multer.File;
  res.json({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    url: `/uploads/${file.filename}`
  });
});

router.get('/list', requireAuth, (_req, res) => {
  const files = fs.readdirSync(uploadsDir).map((name) => ({
    name,
    url: `/uploads/${name}`
  }));
  res.json(files);
});

export default router;
