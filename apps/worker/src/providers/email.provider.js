"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProvider = void 0;
const common_1 = require("@nestjs/common");
let EmailProvider = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EmailProvider = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EmailProvider = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        logger = new common_1.Logger(EmailProvider.name);
        constructor(configService) {
            this.configService = configService;
        }
        async sendEmail(payload) {
            const resendApiKey = this.configService.get('RESEND_API_KEY');
            if (resendApiKey) {
                try {
                    const response = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${resendApiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            from: 'Quravo Platform <no-reply@quravo.com>',
                            to: [payload.to],
                            subject: payload.subject,
                            html: this.renderEmailHtml(payload),
                        }),
                    });
                    if (!response.ok) {
                        const errText = await response.text();
                        throw new Error(`Resend API HTTP ${response.status}: ${errText}`);
                    }
                    this.logger.log(`📧 Sent ${payload.type} email via Resend to ${payload.to}`);
                    return;
                }
                catch (err) {
                    this.logger.error(`Failed to send email via Resend: ${err.message}`);
                    throw err;
                }
            }
            // Dev mode fallback logger
            const actionUrl = payload.type === 'verify-email'
                ? payload.verificationUrl
                : payload.type === 'staff-invite'
                    ? payload.inviteUrl
                    : payload.type === 'password-reset'
                        ? payload.resetUrl
                        : '';
            this.logger.log(`
================================================================================
📧 [DEV EMAIL CONSOLE PROVIDER]
To: ${payload.to}
Subject: ${payload.subject}
Action URL: ${actionUrl}
================================================================================
    `);
        }
        renderEmailHtml(payload) {
            if (payload.type === 'verify-email') {
                return `<h2>Welcome to Quravo, ${payload.firstName}!</h2><p>Please click the link below to verify your account:</p><a href="${payload.verificationUrl}">${payload.verificationUrl}</a>`;
            }
            if (payload.type === 'staff-invite') {
                return `<h2>You've been invited to join ${payload.clinicName}!</h2><p>You have been assigned the <strong>${payload.role}</strong> role. Click below to accept your invitation:</p><a href="${payload.inviteUrl}">${payload.inviteUrl}</a>`;
            }
            return `<h2>Password Reset Request</h2><p>Hi ${payload.firstName || 'there'}, click the link below to reset your password:</p><a href="${payload.resetUrl}">${payload.resetUrl}</a>`;
        }
    };
    return EmailProvider = _classThis;
})();
exports.EmailProvider = EmailProvider;
