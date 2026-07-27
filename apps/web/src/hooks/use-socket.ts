import { useEffect } from 'react';
import { useSocketContext } from '../components/providers/socket-provider';

export function useSocketEvent<T = any>(event: string, callback: (data: T) => void) {
  const { socket, isConnected } = useSocketContext();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, isConnected, event, callback]);
}
