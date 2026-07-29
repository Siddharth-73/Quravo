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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AiController = (() => {
    let _classDecorators = [(0, common_1.Controller)('ai'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _generatePatientSummary_decorators;
    let _generateConsultationNotes_decorators;
    let _getResult_decorators;
    var AiController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _generatePatientSummary_decorators = [(0, common_1.Post)('patient-summary'), (0, common_1.HttpCode)(202)];
            _generateConsultationNotes_decorators = [(0, common_1.Post)('consultation-notes'), (0, common_1.HttpCode)(202)];
            _getResult_decorators = [(0, common_1.Get)('result/:jobId')];
            __esDecorate(this, null, _generatePatientSummary_decorators, { kind: "method", name: "generatePatientSummary", static: false, private: false, access: { has: obj => "generatePatientSummary" in obj, get: obj => obj.generatePatientSummary }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _generateConsultationNotes_decorators, { kind: "method", name: "generateConsultationNotes", static: false, private: false, access: { has: obj => "generateConsultationNotes" in obj, get: obj => obj.generateConsultationNotes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getResult_decorators, { kind: "method", name: "getResult", static: false, private: false, access: { has: obj => "getResult" in obj, get: obj => obj.getResult }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AiController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        queueService = __runInitializers(this, _instanceExtraInitializers);
        constructor(queueService) {
            this.queueService = queueService;
        }
        async generatePatientSummary(req, data) {
            const user = req.user;
            const jobId = crypto.randomUUID();
            await this.queueService.addAiJob('generate-patient-summary', {
                jobId,
                tenantId: user.tenantId,
                userId: user.userId,
                patientId: data.patientId,
            });
            return { status: 'queued', jobId, message: 'Patient summary generation started.' };
        }
        async generateConsultationNotes(req, data) {
            const user = req.user;
            const jobId = crypto.randomUUID();
            await this.queueService.addAiJob('generate-consultation-notes', {
                jobId,
                tenantId: user.tenantId,
                userId: user.userId,
                appointmentId: data.appointmentId,
                rawNotes: data.rawNotes,
            });
            return { status: 'queued', jobId, message: 'Consultation notes generation started.' };
        }
        async getResult(jobId, req) {
            const user = req.user;
            const resultData = await this.queueService.redisConnection.get(`ai:result:${jobId}`);
            if (!resultData) {
                return { status: 'pending' };
            }
            const parsed = JSON.parse(resultData);
            if (parsed.tenantId !== user.tenantId) {
                throw new common_1.NotFoundException('AI result not found');
            }
            return parsed;
        }
    };
    return AiController = _classThis;
})();
exports.AiController = AiController;
