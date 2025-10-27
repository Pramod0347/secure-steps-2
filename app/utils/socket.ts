// lib/socket.ts
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { Socket } from 'net';
import type { NextApiResponse } from 'next';

interface ResponseWithSocket extends NextApiResponse {
  socket: Socket & {
    server: HTTPServer;
  };
}

export class SocketService {
  private static io: SocketIOServer;

  public static getInstance(res?: ResponseWithSocket): SocketIOServer {
    if (!SocketService.io) {
      const httpServer = res?.socket?.server;
      SocketService.io = new SocketIOServer(httpServer, {
        path: '/api/socketio',
        addTrailingSlash: false,
      });
    }
    return SocketService.io;
  }
}