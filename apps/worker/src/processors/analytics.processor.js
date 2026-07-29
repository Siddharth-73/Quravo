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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
const ioredis_1 = __importDefault(require("ioredis"));
let AnalyticsProcessor = (() => {
    let _classDecorators = [(0, bullmq_1.Processor)('analytics.queue')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = bullmq_1.WorkerHost;
    var AnalyticsProcessor = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AnalyticsProcessor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        logger = new common_1.Logger(AnalyticsProcessor.name);
        redisConnection;
        constructor(configService) {
            super();
            this.configService = configService;
            const host = this.configService.get('REDIS_HOST', 'localhost');
            const port = this.configService.get('REDIS_PORT', 6379);
            this.redisConnection = new ioredis_1.default({ host, port });
        }
        async process(job) {
            this.logger.log(`Processing analytics job ${job.id} for tenant ${job.data.tenantId}`);
            if (job.name === 'compute-daily') {
                return this.computeDailyAnalytics(job.data.tenantId, job.data.branchId, job.data.targetDate);
            }
            this.logger.warn(`Unknown job name: ${job.name}`);
        }
        async computeDailyAnalytics(tenantId, branchId, targetDate) {
            const revenueQuery = db_1.db.select({
                total: (0, db_1.sql) `COALESCE(SUM(${db_1.invoices.totalAmount}), 0)`
            })
                .from(db_1.invoices)
                .where((0, db_1.and)((0, db_1.eq)(db_1.invoices.tenantId, tenantId), (0, db_1.eq)(db_1.invoices.status, 'paid'), (0, db_1.sql) `DATE(${db_1.invoices.createdAt}) = ${targetDate}`));
            const appointmentQuery = db_1.db.select({
                total: (0, db_1.sql) `COUNT(*)`
            })
                .from(db_1.appointments)
                .where((0, db_1.and)((0, db_1.eq)(db_1.appointments.tenantId, tenantId), (0, db_1.sql) `DATE(${db_1.appointments.startTime}) = ${targetDate}`));
            const [revenueResult] = await revenueQuery;
            const [appointmentResult] = await appointmentQuery;
            const summary = {
                tenantId,
                branchId: branchId || null,
                summaryDate: targetDate,
                totalRevenue: Number(revenueResult?.total || 0).toFixed(2),
                totalAppointments: Number(appointmentResult?.total || 0),
                totalWalkIns: 0,
                newPatients: 0,
            };
            const [upserted] = await db_1.db.insert(db_1.analyticsSummaries)
                .values(summary)
                .onConflictDoUpdate({
                target: [db_1.analyticsSummaries.tenantId, db_1.analyticsSummaries.branchId, db_1.analyticsSummaries.summaryDate],
                set: {
                    totalRevenue: summary.totalRevenue,
                    totalAppointments: summary.totalAppointments,
                    updatedAt: new Date(),
                }
            })
                .returning();
            const cacheKey = `analytics:tenant:${tenantId}:branch:${branchId || 'all'}:date:${targetDate}`;
            await this.redisConnection.set(cacheKey, JSON.stringify(upserted), 'EX', 3600);
            this.logger.log(`Completed analytics compute for ${cacheKey}`);
            return upserted;
        }
    };
    return AnalyticsProcessor = _classThis;
})();
exports.AnalyticsProcessor = AnalyticsProcessor;
