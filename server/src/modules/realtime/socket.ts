import { Server as SocketIOServer } from 'socket.io';

export function attachSocketServer(io: SocketIOServer) {
  io.on('connection', (socket) => {
    // eslint-disable-next-line no-console
    console.log('client connected', socket.id);

    socket.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('client disconnected', socket.id);
    });
  });
}
