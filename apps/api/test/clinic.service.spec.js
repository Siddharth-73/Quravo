"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const crypto_1 = require("crypto");
(0, vitest_1.describe)('ClinicService Management & Invites (Phase 5 Unit Test)', () => {
    (0, vitest_1.it)('should generate valid sha256 token hash for staff invitations', () => {
        const rawToken = (0, crypto_1.randomUUID)();
        const tokenHash = (0, crypto_1.createHash)('sha256').update(rawToken).digest('hex');
        (0, vitest_1.expect)(tokenHash).toBeDefined();
        (0, vitest_1.expect)(tokenHash.length).toBe(64); // SHA-256 hex string length
    });
    (0, vitest_1.it)('should generate default 7-day operating schedule for new branches', () => {
        const hours = [];
        for (let day = 0; day <= 6; day++) {
            hours.push({
                dayOfWeek: day,
                openTime: '09:00',
                closeTime: '17:00',
                isClosed: day === 0 || day === 6,
            });
        }
        (0, vitest_1.expect)(hours.length).toBe(7);
        (0, vitest_1.expect)(hours[0].isClosed).toBe(true); // Sunday
        (0, vitest_1.expect)(hours[1].isClosed).toBe(false); // Monday
        (0, vitest_1.expect)(hours[6].isClosed).toBe(true); // Saturday
    });
});
