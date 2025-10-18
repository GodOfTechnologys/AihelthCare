import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { getEnv } from './modules/config/env';
import { attachSocketServer } from './modules/realtime/socket';

const env = getEnv();
const port = Number(env.PORT || 5000);

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: env.ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

attachSocketServer(io);
// make io available to routers via app.locals
(app as any).set('io', io);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`GlobalSmart Hub server running on http://localhost:${port}`);
});
