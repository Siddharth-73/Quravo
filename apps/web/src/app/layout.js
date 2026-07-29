"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
require("./globals.css");
const QueryProvider_1 = require("@/providers/QueryProvider");
const ThemeProvider_1 = require("@/providers/ThemeProvider");
const TenantProvider_1 = require("@/providers/TenantProvider");
const AuthProvider_1 = require("@/providers/AuthProvider");
const FeatureFlagProvider_1 = require("@/providers/FeatureFlagProvider");
const PermissionProvider_1 = require("@/providers/PermissionProvider");
const BranchProvider_1 = require("@/providers/BranchProvider");
const SocketProvider_1 = require("@/providers/SocketProvider");
exports.metadata = {
    title: 'Quravo — Multi-Tenant White-Label Healthcare SaaS',
    description: 'Modular enterprise healthcare management platform for clinics and hospitals',
};
function RootLayout({ children }) {
    return (<html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <QueryProvider_1.QueryProvider>
          <ThemeProvider_1.ThemeProvider>
            <TenantProvider_1.TenantProvider>
              <AuthProvider_1.AuthProvider>
                <FeatureFlagProvider_1.FeatureFlagProvider>
                  <PermissionProvider_1.PermissionProvider initialPermissions={['patients:read', 'patients:write', 'appointments:read', 'emr:read', 'billing:read', 'admin:access']}>
                    <BranchProvider_1.BranchProvider>
                      <SocketProvider_1.SocketProvider>
                        {children}
                      </SocketProvider_1.SocketProvider>
                    </BranchProvider_1.BranchProvider>
                  </PermissionProvider_1.PermissionProvider>
                </FeatureFlagProvider_1.FeatureFlagProvider>
              </AuthProvider_1.AuthProvider>
            </TenantProvider_1.TenantProvider>
          </ThemeProvider_1.ThemeProvider>
        </QueryProvider_1.QueryProvider>
      </body>
    </html>);
}
