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
exports.ExportController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const crypto = __importStar(require("crypto"));
let ExportController = (() => {
    let _classDecorators = [(0, common_1.Controller)('export'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _requestExport_decorators;
    let _getExportStatus_decorators;
    let _downloadExport_decorators;
    var ExportController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _requestExport_decorators = [(0, common_1.Post)('request'), (0, common_1.HttpCode)(202)];
            _getExportStatus_decorators = [(0, common_1.Get)(':exportId/status')];
            _downloadExport_decorators = [(0, common_1.Get)(':exportId/download')];
            __esDecorate(this, null, _requestExport_decorators, { kind: "method", name: "requestExport", static: false, private: false, access: { has: obj => "requestExport" in obj, get: obj => obj.requestExport }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getExportStatus_decorators, { kind: "method", name: "getExportStatus", static: false, private: false, access: { has: obj => "getExportStatus" in obj, get: obj => obj.getExportStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _downloadExport_decorators, { kind: "method", name: "downloadExport", static: false, private: false, access: { has: obj => "downloadExport" in obj, get: obj => obj.downloadExport }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ExportController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        queueService = __runInitializers(this, _instanceExtraInitializers);
        constructor(queueService) {
            this.queueService = queueService;
        }
        async requestExport(req, data) {
            const user = req.user;
            const exportId = crypto.randomUUID();
            // Dispatch to background worker
            await this.queueService.addExportJob('generate-export', {
                exportId,
                tenantId: user.tenantId,
                userId: user.userId,
                entity: data.entity,
                format: data.format,
                filters: data.filters,
            });
            return {
                status: 'queued',
                exportId,
                message: 'Export generation started. Poll /status for updates.',
                statusUrl: `/api/v1/export/${exportId}/status`
            };
        }
        async getExportStatus(exportId, req) {
            const user = req.user;
            // The worker stores status in Redis: `export:status:${exportId}`
            const statusData = await this.queueService.redisConnection.get(`export:status:${exportId}`);
            if (!statusData) {
                // If it doesn't exist yet, it's either pending or invalid. We'll return pending for MVP.
                return { status: 'pending' };
            }
            const parsed = JSON.parse(statusData);
            if (parsed.tenantId !== user.tenantId) {
                throw new common_1.NotFoundException('Export not found');
            }
            return parsed;
        }
        async downloadExport(exportId, req, res) {
            const user = req.user;
            const statusData = await this.queueService.redisConnection.get(`export:status:${exportId}`);
            if (!statusData) {
                throw new common_1.NotFoundException('Export not found or expired');
            }
            const parsed = JSON.parse(statusData);
            if (parsed.tenantId !== user.tenantId || parsed.status !== 'completed') {
                throw new common_1.NotFoundException('Export not found or not ready');
            }
            // Worker stores base64 file data in Redis: `export:file:${exportId}`
            const fileData = await this.queueService.redisConnection.get(`export:file:${exportId}`);
            if (!fileData) {
                throw new common_1.NotFoundException('Export file expired');
            }
            const buffer = Buffer.from(fileData, 'base64');
            const extension = parsed.format === 'pdf' ? 'pdf' : 'csv';
            const contentType = parsed.format === 'pdf' ? 'application/pdf' : 'text/csv';
            res.set({
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="export-${exportId}.${extension}"`,
                'Content-Length': buffer.length,
            });
            res.end(buffer);
        }
    };
    return ExportController = _classThis;
})();
exports.ExportController = ExportController;
