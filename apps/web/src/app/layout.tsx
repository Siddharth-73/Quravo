import './globals.css';
import { ReactNode } from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { TenantProvider } from '@/providers/TenantProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { FeatureFlagProvider } from '@/providers/FeatureFlagProvider';
import { PermissionProvider } from '@/providers/PermissionProvider';
import { BranchProvider } from '@/providers/BranchProvider';
import { SocketProvider } from '@/providers/SocketProvider';

export const metadata = {
  title: 'Quravo — Multi-Tenant White-Label Healthcare SaaS',
  description: 'Modular enterprise healthcare management platform for clinics and hospitals',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <QueryProvider>
          <ThemeProvider>
            <TenantProvider>
              <AuthProvider>
                <FeatureFlagProvider>
                  <PermissionProvider initialPermissions={['patients:read', 'patients:write', 'appointments:read', 'emr:read', 'billing:read', 'admin:access']}>
                    <BranchProvider>
                      <SocketProvider>
                        {children}
                      </SocketProvider>
                    </BranchProvider>
                  </PermissionProvider>
                </FeatureFlagProvider>
              </AuthProvider>
            </TenantProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
