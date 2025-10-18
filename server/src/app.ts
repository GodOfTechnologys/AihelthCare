import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import openApiDoc from '../openapi.json';
import { getEnv } from './modules/config/env';
import authRouter from './modules/routes/auth';
import usersRouter from './modules/routes/users';
import messagesRouter from './modules/routes/messages';
import analyticsRouter from './modules/routes/analytics';
import filesRouter from './modules/routes/files';
import settingsRouter from './modules/routes/settings';
import notificationsRouter from './modules/routes/notifications';

const app = express();
const env = getEnv();

app.use(cors({ origin: env.ALLOWED_ORIGIN, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads (stored at <server>/uploads)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'GlobalSmart Hub', time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/files', filesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/notifications', notificationsRouter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc as any));

export default app;
