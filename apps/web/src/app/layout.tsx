import './globals.css';
import { ReactNode } from 'react';
import { SocketProvider } from '../components/providers/socket-provider';
export const metadata = {
  title: 'Quravo — Healthcare SaaS Platform',
  description: 'Multi-tenant white-label healthcare platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
