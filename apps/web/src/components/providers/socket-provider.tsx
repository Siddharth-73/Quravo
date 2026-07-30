'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocketContext = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In a real implementation, we'd retrieve the actual tenantId and userId from context/session
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000/realtime', {
      withCredentials: true,
      extraHeaders: {
        'x-tenant-id': 'tenant-active',
        'x-user-id': 'user-active',
        'x-branch-id': 'branch-active'
      }
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
