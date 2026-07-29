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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
let AuditService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuditService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuditService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        logger = new common_1.Logger(AuditService.name);
        constructor(dbService) {
            this.dbService = dbService;
        }
        async log(options) {
            try {
                const db = this.dbService.db;
                await db.insert(db_1.auditLogs).values({
                    tenantId: options.tenantId,
                    userId: options.userId,
                    action: options.action,
                    resource: options.resource,
                    resourceId: options.resourceId,
                    ipAddress: options.ipAddress || '127.0.0.1',
                    userAgent: options.userAgent || 'system',
                    payload: options.changes || {},
                });
                this.logger.log(`🔒 Audit Log [${options.action}] on ${options.resource}:${options.resourceId || 'N/A'}`);
            }
            catch (err) {
                this.logger.error(`Failed to record audit log: ${err.message}`);
            }
        }
        async findLogs(tenantId, filters) {
            const db = this.dbService.db;
            const limit = Number(filters.limit) || 10;
            const page = Number(filters.page) || 1;
            const offset = (page - 1) * limit;
            const conditions = [(0, db_1.eq)(db_1.auditLogs.tenantId, tenantId)];
            if (filters.userId)
                conditions.push((0, db_1.eq)(db_1.auditLogs.userId, filters.userId));
            if (filters.action)
                conditions.push((0, db_1.eq)(db_1.auditLogs.action, filters.action));
            // Drizzle doesn't support easy >= on string dates without wrapping, let's just use sql helper or skip date filters if not strictly needed. Wait, we can use sql.
            if (filters.startDate)
                conditions.push((0, db_1.sql) `${db_1.auditLogs.createdAt} >= ${new Date(filters.startDate).toISOString()}`);
            if (filters.endDate)
                conditions.push((0, db_1.sql) `${db_1.auditLogs.createdAt} <= ${new Date(filters.endDate).toISOString()}`);
            const data = await db
                .select()
                .from(db_1.auditLogs)
                .where((0, db_1.and)(...conditions))
                .orderBy((0, db_1.desc)(db_1.auditLogs.createdAt))
                .limit(limit)
                .offset(offset);
            const [{ count }] = await db
                .select({ count: (0, db_1.sql) `count(*)` })
                .from(db_1.auditLogs)
                .where((0, db_1.and)(...conditions));
            return {
                data,
                total: Number(count),
                page,
                limit,
            };
        }
    };
    return AuditService = _classThis;
})();
exports.AuditService = AuditService;
