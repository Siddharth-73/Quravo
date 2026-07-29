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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
let AnalyticsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AnalyticsService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AnalyticsService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        queueService;
        logger = new common_1.Logger(AnalyticsService.name);
        constructor(dbService, queueService) {
            this.dbService = dbService;
            this.queueService = queueService;
        }
        /**
         * Get daily analytics for a tenant.
         * Checks Redis cache first. If not found, falls back to the database summary,
         * and dispatches a background job to recompute if missing.
         */
        async getDailySummary(tenantId, branchId, targetDate) {
            const dateStr = targetDate || new Date().toISOString().split('T')[0];
            const redis = this.queueService.redisConnection;
            const cacheKey = `analytics:tenant:${tenantId}:branch:${branchId || 'all'}:date:${dateStr}`;
            try {
                const cached = await redis.get(cacheKey);
                if (cached) {
                    return JSON.parse(cached);
                }
            }
            catch (e) {
                this.logger.warn(`Redis cache fetch failed for key ${cacheKey}`, e);
            }
            // Fallback to database
            let dbSummary;
            const db = this.dbService.db;
            if (branchId) {
                const [result] = await db.select().from(db_1.analyticsSummaries)
                    .where((0, db_1.and)((0, db_1.eq)(db_1.analyticsSummaries.tenantId, tenantId), (0, db_1.eq)(db_1.analyticsSummaries.branchId, branchId), (0, db_1.eq)(db_1.analyticsSummaries.summaryDate, dateStr))).limit(1);
                dbSummary = result;
            }
            else {
                const [result] = await db.select().from(db_1.analyticsSummaries)
                    .where((0, db_1.and)((0, db_1.eq)(db_1.analyticsSummaries.tenantId, tenantId), (0, db_1.eq)(db_1.analyticsSummaries.summaryDate, dateStr))).limit(1);
                dbSummary = result;
            }
            if (dbSummary) {
                // Re-populate cache for future requests
                await redis.set(cacheKey, JSON.stringify(dbSummary), 'EX', 3600); // 1 hour cache
                return dbSummary;
            }
            // If completely missing, dispatch an on-demand calculation job to the worker
            this.logger.log(`Dispatching on-demand analytics calculation for ${cacheKey}`);
            await this.queueService.addAnalyticsJob('compute-daily', {
                tenantId,
                branchId,
                targetDate: dateStr,
            });
            // Return empty state while calculating
            return {
                tenantId,
                branchId,
                summaryDate: dateStr,
                totalRevenue: '0.00',
                totalAppointments: 0,
                totalWalkIns: 0,
                newPatients: 0,
                calculating: true,
            };
        }
    };
    return AnalyticsService = _classThis;
})();
exports.AnalyticsService = AnalyticsService;
