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
exports.ClinicController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
let ClinicController = (() => {
    let _classDecorators = [(0, common_1.Controller)('clinic')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getPublicBranding_decorators;
    let _getBranding_decorators;
    let _updateBranding_decorators;
    let _getBranches_decorators;
    let _createBranch_decorators;
    let _getWorkingHours_decorators;
    let _updateWorkingHours_decorators;
    let _getStaff_decorators;
    let _inviteStaff_decorators;
    let _acceptInvite_decorators;
    var ClinicController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getPublicBranding_decorators = [(0, common_1.Get)('public/branding')];
            _getBranding_decorators = [(0, common_1.Get)('branding'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard)];
            _updateBranding_decorators = [(0, common_1.Put)('branding'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('clinic:write')];
            _getBranches_decorators = [(0, common_1.Get)('branches'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard)];
            _createBranch_decorators = [(0, common_1.Post)('branches'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('clinic:write')];
            _getWorkingHours_decorators = [(0, common_1.Get)('branches/:branchId/hours'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard)];
            _updateWorkingHours_decorators = [(0, common_1.Put)('branches/:branchId/hours'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('clinic:write')];
            _getStaff_decorators = [(0, common_1.Get)('staff'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('users:read')];
            _inviteStaff_decorators = [(0, common_1.Post)('staff/invite'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('users:write')];
            _acceptInvite_decorators = [(0, common_1.Post)('staff/accept-invite')];
            __esDecorate(this, null, _getPublicBranding_decorators, { kind: "method", name: "getPublicBranding", static: false, private: false, access: { has: obj => "getPublicBranding" in obj, get: obj => obj.getPublicBranding }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getBranding_decorators, { kind: "method", name: "getBranding", static: false, private: false, access: { has: obj => "getBranding" in obj, get: obj => obj.getBranding }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateBranding_decorators, { kind: "method", name: "updateBranding", static: false, private: false, access: { has: obj => "updateBranding" in obj, get: obj => obj.updateBranding }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getBranches_decorators, { kind: "method", name: "getBranches", static: false, private: false, access: { has: obj => "getBranches" in obj, get: obj => obj.getBranches }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createBranch_decorators, { kind: "method", name: "createBranch", static: false, private: false, access: { has: obj => "createBranch" in obj, get: obj => obj.createBranch }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getWorkingHours_decorators, { kind: "method", name: "getWorkingHours", static: false, private: false, access: { has: obj => "getWorkingHours" in obj, get: obj => obj.getWorkingHours }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateWorkingHours_decorators, { kind: "method", name: "updateWorkingHours", static: false, private: false, access: { has: obj => "updateWorkingHours" in obj, get: obj => obj.updateWorkingHours }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getStaff_decorators, { kind: "method", name: "getStaff", static: false, private: false, access: { has: obj => "getStaff" in obj, get: obj => obj.getStaff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _inviteStaff_decorators, { kind: "method", name: "inviteStaff", static: false, private: false, access: { has: obj => "inviteStaff" in obj, get: obj => obj.inviteStaff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _acceptInvite_decorators, { kind: "method", name: "acceptInvite", static: false, private: false, access: { has: obj => "acceptInvite" in obj, get: obj => obj.acceptInvite }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ClinicController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        clinicService = __runInitializers(this, _instanceExtraInitializers);
        constructor(clinicService) {
            this.clinicService = clinicService;
        }
        async getPublicBranding(req) {
            const tenantId = req.tenant?.id;
            if (!tenantId)
                throw new common_1.NotFoundException('Clinic subdomain context missing.');
            return this.clinicService.getBranding(tenantId);
        }
        async getBranding(req) {
            const tenantId = req.user.tenantId;
            return this.clinicService.getBranding(tenantId);
        }
        async updateBranding(req, dto) {
            const tenantId = req.user.tenantId;
            return this.clinicService.updateBranding(tenantId, dto);
        }
        async getBranches(req) {
            const tenantId = req.user.tenantId;
            return this.clinicService.getBranches(tenantId);
        }
        async createBranch(req, dto) {
            const tenantId = req.user.tenantId;
            return this.clinicService.createBranch(tenantId, dto);
        }
        async getWorkingHours(req, branchId) {
            const tenantId = req.user.tenantId;
            return this.clinicService.getWorkingHours(tenantId, branchId);
        }
        async updateWorkingHours(req, branchId, dto) {
            const tenantId = req.user.tenantId;
            return this.clinicService.updateWorkingHours(tenantId, branchId, dto);
        }
        async getStaff(req) {
            const tenantId = req.user.tenantId;
            return this.clinicService.getStaff(tenantId);
        }
        async inviteStaff(req, dto) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            return this.clinicService.inviteStaff(tenantId, userId, dto);
        }
        async acceptInvite(dto) {
            return this.clinicService.acceptInvite(dto);
        }
    };
    return ClinicController = _classThis;
})();
exports.ClinicController = ClinicController;
