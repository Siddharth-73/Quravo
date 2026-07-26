export class UpdateBrandingDto {
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  timezone?: string;
  currency?: string;
  settings?: Record<string, any>;
}
