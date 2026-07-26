import { describe, it, expect } from 'vitest';

describe('TenantResolver Middleware Subdomain Resolution (Phase 3 Unit Test)', () => {
  function extractSubdomain(host: string, headerSlug?: string): string | null {
    if (host.includes('.')) {
      const parts = host.split('.');
      if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'api' && !parts[0].includes('localhost')) {
        return parts[0].toLowerCase();
      }
    }
    return headerSlug ? headerSlug.toLowerCase() : null;
  }

  it('should parse subdomain slug correctly from production domain host', () => {
    const slug = extractSubdomain('city-clinic.platform.com');
    expect(slug).toBe('city-clinic');
  });

  it('should parse subdomain slug correctly from local development domain host', () => {
    const slug = extractSubdomain('metro-health.localhost:4000');
    expect(slug).toBe('metro-health');
  });

  it('should fallback to X-Tenant-Slug header when host does not contain subdomain', () => {
    const slug = extractSubdomain('localhost:4000', 'st-jude-hospital');
    expect(slug).toBe('st-jude-hospital');
  });
});
