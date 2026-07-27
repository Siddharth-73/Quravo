export interface TenantThemeConfig {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  danger: string;
  dangerForeground: string;
  radius: string;
  fontFamily?: string;
  logoUrl?: string;
  sidebarBg?: string;
  sidebarFg?: string;
  cardBg?: string;
  cardFg?: string;
  chartPalette: string[];
}

export const defaultThemeTokens: TenantThemeConfig = {
  primary: '221.2 83.2% 53.3%', // Vibrant Medical Blue
  primaryForeground: '210 40% 98%',
  secondary: '210 40% 96.1%',
  secondaryForeground: '222.2 47.4% 11.2%',
  accent: '199 89% 48%', // Teal / Cyan Accent
  accentForeground: '210 40% 98%',
  muted: '210 40% 96.1%',
  mutedForeground: '215.4 16.3% 46.9%',
  success: '142.1 76.2% 36.3%', // Emerald Green
  successForeground: '355.7 100% 97.3%',
  warning: '38 92% 50%', // Amber Warning
  warningForeground: '48 96% 89%',
  danger: '0 84.2% 60.2%', // Rose Red
  dangerForeground: '210 40% 98%',
  radius: '0.625rem',
  fontFamily: 'Inter, sans-serif',
  chartPalette: [
    '221.2 83.2% 53.3%',
    '199 89% 48%',
    '142.1 76.2% 36.3%',
    '38 92% 50%',
    '262.1 83.3% 57.8%',
  ],
};
