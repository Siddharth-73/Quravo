"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmrController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const module_guard_1 = require("../../common/guards/module.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const module_decorator_1 = require("../../common/decorators/module.decorator");
let EmrController = (() => {
    let _classDecorators = [(0, common_1.Controller)('emr'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, module_guard_1.ModuleGuard, permissions_guard_1.PermissionsGuard), (0, module_decorator_1.RequireModule)('emr')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getEncounters_decorators;
    let _createEncounter_decorators;
    let _getEncounterById_decorators;
    let _updateEncounter_decorators;
    let _finalizeEncounter_decorators;
    let _createPrescription_decorators;
    let _getPatientEncounters_decorators;
    var EmrController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getEncounters_decorators = [(0, common_1.Get)('encounters'), (0, permissions_decorator_1.RequirePermissions)('emr:read')];
            _createEncounter_decorators = [(0, common_1.Post)('encounters'), (0, permissions_decorator_1.RequirePermissions)('emr:write')];
            _getEncounterById_decorators = [(0, common_1.Get)('encounters/:id'), (0, permissions_decorator_1.RequirePermissions)('emr:read')];
            _updateEncounter_decorators = [(0, common_1.Put)('encounters/:id'), (0, permissions_decorator_1.RequirePermissions)('emr:write')];
            _finalizeEncounter_decorators = [(0, common_1.Put)('encounters/:id/finalize'), (0, permissions_decorator_1.RequirePermissions)('emr:finalize')];
            _createPrescription_decorators = [(0, common_1.Post)('prescriptions'), (0, permissions_decorator_1.RequirePermissions)('emr:write')];
            _getPatientEncounters_decorators = [(0, common_1.Get)('patients/:patientId/encounters'), (0, permissions_decorator_1.RequirePermissions)('emr:read')];
            __esDecorate(this, null, _getEncounters_decorators, { kind: "method", name: "getEncounters", static: false, private: false, access: { has: obj => "getEncounters" in obj, get: obj => obj.getEncounters }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createEncounter_decorators, { kind: "method", name: "createEncounter", static: false, private: false, access: { has: obj => "createEncounter" in obj, get: obj => obj.createEncounter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getEncounterById_decorators, { kind: "method", name: "getEncounterById", static: false, private: false, access: { has: obj => "getEncounterById" in obj, get: obj => obj.getEncounterById }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateEncounter_decorators, { kind: "method", name: "updateEncounter", static: false, private: false, access: { has: obj => "updateEncounter" in obj, get: obj => obj.updateEncounter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _finalizeEncounter_decorators, { kind: "method", name: "finalizeEncounter", static: false, private: false, access: { has: obj => "finalizeEncounter" in obj, get: obj => obj.finalizeEncounter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createPrescription_decorators, { kind: "method", name: "createPrescription", static: false, private: false, access: { has: obj => "createPrescription" in obj, get: obj => obj.createPrescription }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPatientEncounters_decorators, { kind: "method", name: "getPatientEncounters", static: false, private: false, access: { has: obj => "getPatientEncounters" in obj, get: obj => obj.getPatientEncounters }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EmrController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        emrService = __runInitializers(this, _instanceExtraInitializers);
        constructor(emrService) {
            this.emrService = emrService;
        }
        async getEncounters(req, patientId) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            if (patientId) {
                return this.emrService.getPatientEncounters(tenantId, userId, patientId);
            }
            return this.emrService.getAllEncounters(tenantId);
        }
        async createEncounter(req, dto) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            return this.emrService.createEncounter(tenantId, userId, dto);
        }
        async getEncounterById(req, id) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            return this.emrService.getEncounterById(tenantId, userId, id);
        }
        async updateEncounter(req, id, dto) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            return this.emrService.updateEncounter(tenantId, userId, id, dto);
        }
        async finalizeEncounter(req, id) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            return this.emrService.finalizeEncounter(tenantId, userId, id);
        }
        async createPrescription(req, dto) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            return this.emrService.createPrescription(tenantId, userId, dto);
        }
        async getPatientEncounters(req, patientId) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            return this.emrService.getPatientEncounters(tenantId, userId, patientId);
        }
    };
    return EmrController = _classThis;
})();
exports.EmrController = EmrController;
