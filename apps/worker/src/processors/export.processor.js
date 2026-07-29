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
exports.ExportProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const json2csv_1 = require("json2csv");
const pdfkit_1 = __importDefault(require("pdfkit"));
const db_1 = require("@quravo/db");
let ExportProcessor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExportProcessor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ExportProcessor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        logger = new common_1.Logger(ExportProcessor.name);
        worker;
        redisConnection;
        constructor(configService) {
            this.configService = configService;
        }
        onModuleInit() {
            const redisHost = this.configService.get('REDIS_HOST', 'localhost');
            const redisPort = this.configService.get('REDIS_PORT', 6379);
            this.redisConnection = new ioredis_1.default({
                host: redisHost,
                port: redisPort,
                maxRetriesPerRequest: null,
            });
            this.worker = new bullmq_1.Worker('export.queue', async (job) => {
                this.logger.log(`Processing export job: ${job.name} (ID: ${job.id})`);
                try {
                    if (job.name === 'generate-export') {
                        await this.processExport(job);
                    }
                    else {
                        this.logger.warn(`Unknown export job type: ${job.name}`);
                    }
                }
                catch (error) {
                    this.logger.error(`Failed to process export job ${job.id}`, error);
                    await this.updateStatus(job.data.exportId, job.data.tenantId, 'failed', job.data.format);
                    throw error;
                }
            }, { connection: this.redisConnection });
            this.worker.on('failed', (job, err) => {
                this.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
            });
        }
        async updateStatus(exportId, tenantId, status, format, error) {
            const payload = JSON.stringify({
                tenantId,
                status,
                format,
                updatedAt: new Date().toISOString(),
                ...(error ? { error } : {}),
            });
            await this.redisConnection.set(`export:status:${exportId}`, payload, 'EX', 3600);
        }
        async saveFileData(exportId, buffer) {
            const base64Data = buffer.toString('base64');
            await this.redisConnection.set(`export:file:${exportId}`, base64Data, 'EX', 3600);
        }
        async processExport(job) {
            const { exportId, tenantId, entity, format } = job.data;
            await this.updateStatus(exportId, tenantId, 'processing', format);
            let data;
            // TODO: apply job.data.filters
            if (entity === 'patients') {
                data = await db_1.db
                    .select({
                    id: db_1.patients.id,
                    patientNumber: db_1.patients.patientNumber,
                    firstName: db_1.patients.firstName,
                    lastName: db_1.patients.lastName,
                    email: db_1.patients.email,
                    phone: db_1.patients.phone,
                    status: db_1.patients.status,
                })
                    .from(db_1.patients)
                    .where((0, db_1.eq)(db_1.patients.tenantId, tenantId));
            }
            else if (entity === 'invoices') {
                data = await db_1.db.select().from(db_1.invoices).where((0, db_1.eq)(db_1.invoices.tenantId, tenantId));
            }
            else {
                const errorMessage = `Unsupported export entity: ${entity}`;
                this.logger.warn(errorMessage);
                await this.updateStatus(exportId, tenantId, 'failed', format, errorMessage);
                return;
            }
            let fileBuffer;
            if (format === 'csv') {
                const csv = data.length ? (0, json2csv_1.parse)(data) : '';
                fileBuffer = Buffer.from(csv);
            }
            else if (format === 'pdf') {
                fileBuffer = await new Promise((resolve) => {
                    const doc = new pdfkit_1.default();
                    const chunks = [];
                    doc.on('data', (chunk) => chunks.push(chunk));
                    doc.on('end', () => resolve(Buffer.concat(chunks)));
                    doc.fontSize(20).text(`Export: ${entity}`, { align: 'center' });
                    doc.moveDown();
                    data.forEach((row) => {
                        const line = Object.entries(row)
                            .map(([key, value]) => `${key}: ${value ?? 'N/A'}`)
                            .join(' | ');
                        doc.fontSize(12).text(line);
                        doc.moveDown(0.5);
                    });
                    doc.end();
                });
            }
            else {
                throw new Error(`Unsupported export format: ${format}`);
            }
            await this.saveFileData(exportId, fileBuffer);
            await this.updateStatus(exportId, tenantId, 'completed', format);
            this.logger.log(`Export ${exportId} completed successfully.`);
        }
    };
    return ExportProcessor = _classThis;
})();
exports.ExportProcessor = ExportProcessor;
