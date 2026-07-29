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
exports.AiProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const db_1 = require("@quravo/db");
const contracts_1 = require("@quravo/contracts");
let AiProcessor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AiProcessor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AiProcessor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        aiService;
        logger = new common_1.Logger(AiProcessor.name);
        worker;
        redisConnection;
        constructor(configService, aiService) {
            this.configService = configService;
            this.aiService = aiService;
        }
        onModuleInit() {
            const redisHost = this.configService.get('REDIS_HOST', 'localhost');
            const redisPort = this.configService.get('REDIS_PORT', 6379);
            this.redisConnection = new ioredis_1.default({
                host: redisHost,
                port: redisPort,
                maxRetriesPerRequest: null,
            });
            this.worker = new bullmq_1.Worker('ai.queue', async (job) => {
                this.logger.log(`Processing AI job: ${job.name} (ID: ${job.id})`);
                const { jobId, tenantId } = job.data;
                try {
                    if (job.name === 'generate-patient-summary') {
                        await this.processPatientSummary(job);
                    }
                    else if (job.name === 'generate-consultation-notes') {
                        await this.processConsultationNotes(job);
                    }
                    else {
                        this.logger.warn(`Unknown AI job type: ${job.name}`);
                    }
                }
                catch (error) {
                    this.logger.error(`Failed to process AI job ${job.id}`, error);
                    if (jobId) {
                        await this.saveResult(jobId, {
                            tenantId,
                            status: 'failed',
                            error: error.message,
                        });
                    }
                    throw error;
                }
            }, { connection: this.redisConnection });
            this.worker.on('failed', (job, err) => {
                this.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
            });
        }
        async saveResult(jobId, payload) {
            await this.redisConnection.set(`ai:result:${jobId}`, JSON.stringify(payload), 'EX', 3600);
        }
        async processPatientSummary(job) {
            const { jobId, tenantId, patientId } = job.data;
            const [patient] = await db_1.db
                .select()
                .from(db_1.patients)
                .where((0, db_1.and)((0, db_1.eq)(db_1.patients.tenantId, tenantId), (0, db_1.eq)(db_1.patients.id, patientId)))
                .limit(1);
            if (!patient) {
                this.logger.warn(`Patient ${patientId} not found for tenant ${tenantId}`);
                await this.saveResult(jobId, {
                    tenantId,
                    status: 'failed',
                    error: `Patient ${patientId} not found`,
                });
                return;
            }
            const recentEncounters = await db_1.db
                .select()
                .from(db_1.emrEncounters)
                .where((0, db_1.and)((0, db_1.eq)(db_1.emrEncounters.tenantId, tenantId), (0, db_1.eq)(db_1.emrEncounters.patientId, patientId)))
                .orderBy((0, db_1.desc)(db_1.emrEncounters.encounterDate))
                .limit(5);
            const encountersSummary = recentEncounters.length
                ? recentEncounters
                    .map((enc, idx) => {
                    const diagnosis = Array.isArray(enc.assessmentDiagnosis) ? enc.assessmentDiagnosis.join(', ') : '';
                    return `${idx + 1}. Date: ${new Date(enc.encounterDate).toISOString().slice(0, 10)} | Chief Complaint: ${enc.chiefComplaint} | Assessment: ${diagnosis || 'N/A'} | Plan: ${enc.treatmentPlan || 'N/A'}`;
                })
                    .join('\n')
                : 'No prior encounters on record.';
            const context = `Patient: ${patient.firstName} ${patient.lastName}
Date of Birth: ${patient.dateOfBirth}
Gender: ${patient.gender}
Blood Group: ${patient.bloodGroup || 'Unknown'}

Recent Encounters:
${encountersSummary}`;
            const generated = await this.aiService.generateCompletion([
                { role: 'system', content: contracts_1.PATIENT_SUMMARY_PROMPT },
                { role: 'user', content: `Summarize the clinical profile for the following patient:\n\n${context}` }
            ]);
            await this.saveResult(jobId, {
                tenantId,
                status: 'completed',
                result: generated,
                completedAt: new Date().toISOString(),
            });
            this.logger.log(`Successfully generated summary for patient ${patientId}`);
            return generated;
        }
        async processConsultationNotes(job) {
            const { jobId, tenantId, appointmentId, rawNotes } = job.data;
            const generated = await this.aiService.generateCompletion([
                { role: 'system', content: contracts_1.CONSULTATION_NOTES_PROMPT },
                { role: 'user', content: `Here are the raw notes: ${rawNotes}` }
            ]);
            await this.saveResult(jobId, {
                tenantId,
                status: 'completed',
                result: generated,
                completedAt: new Date().toISOString(),
            });
            this.logger.log(`Successfully generated SOAP notes for appointment ${appointmentId}`);
            return generated;
        }
    };
    return AiProcessor = _classThis;
})();
exports.AiProcessor = AiProcessor;
