// app/utils/socket-client.ts
import { io, Socket } from 'socket.io-client';

export class SocketClient {
  private static socket: Socket | null = null;

  static connect(): Socket {
    if (!this.socket) {
      this.socket = io({
        path: '/api/socketio',
        addTrailingSlash: false,
      });
    }
    return this.socket;
  }

  static disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
