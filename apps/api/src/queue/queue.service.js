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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
let QueueService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var QueueService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            QueueService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        emailQueue;
        auditQueue;
        analyticsQueue;
        aiQueue;
        exportQueue;
        redisConnection;
        constructor(configService) {
            this.configService = configService;
            const redisHost = this.configService.get('REDIS_HOST', 'localhost');
            const redisPort = this.configService.get('REDIS_PORT', 6379);
            this.redisConnection = new ioredis_1.default({
                host: redisHost,
                port: redisPort,
                maxRetriesPerRequest: null,
            });
            this.emailQueue = new bullmq_1.Queue('email.queue', { connection: this.redisConnection });
            this.auditQueue = new bullmq_1.Queue('audit.queue', { connection: this.redisConnection });
            this.analyticsQueue = new bullmq_1.Queue('analytics.queue', { connection: this.redisConnection });
            this.aiQueue = new bullmq_1.Queue('ai.queue', { connection: this.redisConnection });
            this.exportQueue = new bullmq_1.Queue('export.queue', { connection: this.redisConnection });
        }
        onModuleInit() { }
        async addJob(jobName, data) {
            return this.emailQueue.add(jobName, data);
        }
        async addAuditJob(jobName, data) {
            return this.auditQueue.add(jobName, data);
        }
        async addExportJob(jobName, data) {
            return this.exportQueue.add(jobName, data);
        }
        async addAiJob(jobName, data) {
            return this.aiQueue.add(jobName, data);
        }
        async addAnalyticsJob(name, data) {
            await this.analyticsQueue.add(name, data);
        }
        async getRedisStatus() {
            try {
                const ping = await this.redisConnection.ping();
                return ping === 'PONG';
            }
            catch {
                return false;
            }
        }
        async onModuleDestroy() {
            if (this.emailQueue)
                await this.emailQueue.close();
            if (this.auditQueue)
                await this.auditQueue.close();
            if (this.analyticsQueue)
                await this.analyticsQueue.close();
            if (this.aiQueue)
                await this.aiQueue.close();
            if (this.exportQueue)
                await this.exportQueue.close();
            if (this.redisConnection)
                await this.redisConnection.quit();
        }
    };
    return QueueService = _classThis;
})();
exports.QueueService = QueueService;
