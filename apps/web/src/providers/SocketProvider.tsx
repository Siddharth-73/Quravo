"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Bell, Sparkles, X } from 'lucide-react';

interface RealtimeToast {
  id: string;
  title: string;
  message: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  toasts: RealtimeToast[];
  removeToast: (id: string) => void;
  triggerToast: (title: string, message: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState<RealtimeToast[]>([]);

  const triggerToast = (title: string, message: string) => {
    const id = String(Date.now());
    setToasts((prev) => [...prev, { id, title, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000/realtime';
    const socketInstance = io(wsUrl, {
      withCredentials: true,
      autoConnect: false,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('notification:new', (data: { title: string; message: string }) => {
      triggerToast(data.title || 'Realtime Alert', data.message || 'New clinic update received');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, toasts, removeToast, triggerToast }}>
      {children}

      {/* Floating Realtime Toast Notifications Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-start justify-between gap-3 p-4 rounded-xl border border-primary/20 bg-card/95 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-foreground">{toast.title}</div>
                <div className="text-muted-foreground">{toast.message}</div>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
