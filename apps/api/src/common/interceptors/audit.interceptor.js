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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
let AuditInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuditInterceptor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuditInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        queueService;
        constructor(queueService) {
            this.queueService = queueService;
        }
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            // We only want to log mutations (POST, PUT, PATCH, DELETE)
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
                const user = request.user;
                if (user) {
                    // Scrub sensitive fields before sending to queue
                    const sanitizedBody = this.sanitizePayload(request.body);
                    // Dispatch audit log to background worker
                    this.queueService.addAuditJob('log-audit-event', {
                        tenantId: user.tenantId,
                        userId: user.userId,
                        action: `${request.method} ${request.route.path}`,
                        entity: this.extractEntity(request.route.path),
                        entityId: request.params.id || null,
                        details: sanitizedBody,
                    }).catch(err => console.error('Failed to dispatch audit log:', err));
                }
            }
            return next.handle();
        }
        sanitizePayload(body) {
            if (!body)
                return {};
            const sanitized = { ...body };
            const sensitiveKeys = ['password', 'token', 'secret', 'creditCard'];
            for (const key of Object.keys(sanitized)) {
                if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
                    sanitized[key] = '[REDACTED]';
                }
            }
            return sanitized;
        }
        extractEntity(path) {
            const parts = path.split('/').filter(p => p && !p.startsWith(':'));
            return parts.length > 2 ? parts[2] : 'system';
        }
    };
    return AuditInterceptor = _classThis;
})();
exports.AuditInterceptor = AuditInterceptor;
