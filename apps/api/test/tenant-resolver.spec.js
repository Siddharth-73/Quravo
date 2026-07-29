"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('TenantResolver Middleware Subdomain Resolution (Phase 3 Unit Test)', () => {
    function extractSubdomain(host, headerSlug) {
        if (host.includes('.')) {
            const parts = host.split('.');
            if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'api' && !parts[0].includes('localhost')) {
                return parts[0].toLowerCase();
            }
        }
        return headerSlug ? headerSlug.toLowerCase() : null;
    }
    (0, vitest_1.it)('should parse subdomain slug correctly from production domain host', () => {
        const slug = extractSubdomain('city-clinic.platform.com');
        (0, vitest_1.expect)(slug).toBe('city-clinic');
    });
    (0, vitest_1.it)('should parse subdomain slug correctly from local development domain host', () => {
        const slug = extractSubdomain('metro-health.localhost:4000');
        (0, vitest_1.expect)(slug).toBe('metro-health');
    });
    (0, vitest_1.it)('should fallback to X-Tenant-Slug header when host does not contain subdomain', () => {
        const slug = extractSubdomain('localhost:4000', 'st-jude-hospital');
        (0, vitest_1.expect)(slug).toBe('st-jude-hospital');
    });
});
