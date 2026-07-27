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
    // For this MVP layout, we inject mock headers to simulate the multi-tenant handshake
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000/realtime', {
      withCredentials: true,
      extraHeaders: {
        'x-tenant-id': 'tenant-mock', // TODO: Get from useAuth/useTenant
        'x-user-id': 'user-mock',
        'x-branch-id': 'branch-mock'
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
