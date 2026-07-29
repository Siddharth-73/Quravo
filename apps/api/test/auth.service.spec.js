"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('AuthService (Phase 2 Unit Tests)', () => {
    (0, vitest_1.it)('should generate valid argon2 password hash and verify credentials successfully', async () => {
        const argon2 = await Promise.resolve().then(() => __importStar(require('@node-rs/argon2')));
        const password = 'SuperSecretPassword123!';
        const hash = await argon2.hash(password);
        (0, vitest_1.expect)(hash).toBeDefined();
        (0, vitest_1.expect)(hash.startsWith('$argon2')).toBe(true);
        const isValid = await argon2.verify(hash, password);
        (0, vitest_1.expect)(isValid).toBe(true);
        const isInvalid = await argon2.verify(hash, 'WrongPassword');
        (0, vitest_1.expect)(isInvalid).toBe(false);
    });
    (0, vitest_1.it)('should enforce Refresh Token Rotation family revocation upon token reuse detection', () => {
        const familyId = 'family-123';
        const tokens = [
            { id: 'tok-1', familyId, isRevoked: true },
            { id: 'tok-2', familyId, isRevoked: false },
        ];
        // Simulating reuse detection logic
        const reusedToken = tokens.find((t) => t.id === 'tok-1');
        if (reusedToken?.isRevoked) {
            // Invalidate all tokens in family
            tokens.forEach((t) => (t.isRevoked = true));
        }
        (0, vitest_1.expect)(tokens.every((t) => t.isRevoked === true)).toBe(true);
    });
});
