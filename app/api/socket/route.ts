// pages/api/socketio.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket } from 'net';

interface ResponseWithSocket extends NextApiResponse {
  socket: Socket & {
    server: HTTPServer & {
      io?: SocketIOServer;
    };
  };
}

const SocketHandler = (req: NextApiRequest, res: ResponseWithSocket) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new SocketIOServer(res.socket.server, {
    path: '/api/socketio',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Save the io instance on the server object
  res.socket.server.io = io;

  io.on('connection', (socket) => {
  });

  res.end();
};

export default SocketHandler;