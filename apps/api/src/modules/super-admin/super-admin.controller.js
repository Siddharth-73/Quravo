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
exports.SuperAdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const super_admin_guard_1 = require("./guards/super-admin.guard");
let SuperAdminController = (() => {
    let _classDecorators = [(0, common_1.Controller)('super-admin'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, super_admin_guard_1.SuperAdminGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _provisionTenant_decorators;
    let _listTenants_decorators;
    let _getTenantConfig_decorators;
    let _updateTenantConfig_decorators;
    var SuperAdminController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _provisionTenant_decorators = [(0, common_1.Post)('tenants')];
            _listTenants_decorators = [(0, common_1.Get)('tenants')];
            _getTenantConfig_decorators = [(0, common_1.Get)('tenants/:id/config')];
            _updateTenantConfig_decorators = [(0, common_1.Put)('tenants/:id/config')];
            __esDecorate(this, null, _provisionTenant_decorators, { kind: "method", name: "provisionTenant", static: false, private: false, access: { has: obj => "provisionTenant" in obj, get: obj => obj.provisionTenant }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _listTenants_decorators, { kind: "method", name: "listTenants", static: false, private: false, access: { has: obj => "listTenants" in obj, get: obj => obj.listTenants }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getTenantConfig_decorators, { kind: "method", name: "getTenantConfig", static: false, private: false, access: { has: obj => "getTenantConfig" in obj, get: obj => obj.getTenantConfig }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateTenantConfig_decorators, { kind: "method", name: "updateTenantConfig", static: false, private: false, access: { has: obj => "updateTenantConfig" in obj, get: obj => obj.updateTenantConfig }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SuperAdminController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        superAdminService = __runInitializers(this, _instanceExtraInitializers);
        constructor(superAdminService) {
            this.superAdminService = superAdminService;
        }
        async provisionTenant(dto) {
            return this.superAdminService.provisionTenant(dto);
        }
        async listTenants() {
            return this.superAdminService.listTenants();
        }
        async getTenantConfig(id) {
            return this.superAdminService.getTenantConfig(id);
        }
        async updateTenantConfig(id, dto) {
            return this.superAdminService.updateTenantConfig(id, dto);
        }
    };
    return SuperAdminController = _classThis;
})();
exports.SuperAdminController = SuperAdminController;
