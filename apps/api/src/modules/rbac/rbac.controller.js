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
exports.RbacController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
let RbacController = (() => {
    let _classDecorators = [(0, common_1.Controller)('rbac'), (0, throttler_1.SkipThrottle)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getModules_decorators;
    let _toggleModule_decorators;
    let _getRoles_decorators;
    let _createRole_decorators;
    let _updateRolePermissions_decorators;
    var RbacController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getModules_decorators = [(0, common_1.Get)('modules')];
            _toggleModule_decorators = [(0, common_1.Post)('modules/toggle'), (0, permissions_decorator_1.RequirePermissions)('roles:write')];
            _getRoles_decorators = [(0, common_1.Get)('roles')];
            _createRole_decorators = [(0, common_1.Post)('roles'), (0, permissions_decorator_1.RequirePermissions)('roles:write')];
            _updateRolePermissions_decorators = [(0, common_1.Put)('roles/:roleName/permissions'), (0, permissions_decorator_1.RequirePermissions)('roles:write')];
            __esDecorate(this, null, _getModules_decorators, { kind: "method", name: "getModules", static: false, private: false, access: { has: obj => "getModules" in obj, get: obj => obj.getModules }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _toggleModule_decorators, { kind: "method", name: "toggleModule", static: false, private: false, access: { has: obj => "toggleModule" in obj, get: obj => obj.toggleModule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRoles_decorators, { kind: "method", name: "getRoles", static: false, private: false, access: { has: obj => "getRoles" in obj, get: obj => obj.getRoles }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createRole_decorators, { kind: "method", name: "createRole", static: false, private: false, access: { has: obj => "createRole" in obj, get: obj => obj.createRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateRolePermissions_decorators, { kind: "method", name: "updateRolePermissions", static: false, private: false, access: { has: obj => "updateRolePermissions" in obj, get: obj => obj.updateRolePermissions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RbacController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        rbacService = __runInitializers(this, _instanceExtraInitializers);
        constructor(rbacService) {
            this.rbacService = rbacService;
        }
        async getModules(req) {
            const tenantId = req.user.tenantId;
            return this.rbacService.getTenantModules(tenantId);
        }
        async toggleModule(req, body) {
            const tenantId = req.user.tenantId;
            return this.rbacService.toggleTenantModule(tenantId, body.moduleKey, body.enabled);
        }
        async getRoles(req) {
            const tenantId = req.user.tenantId;
            return this.rbacService.getTenantRoles(tenantId);
        }
        async createRole(req, body) {
            const tenantId = req.user.tenantId;
            return this.rbacService.createRole(tenantId, body.name, body.description, body.permissions);
        }
        async updateRolePermissions(req, roleName, body) {
            const tenantId = req.user.tenantId;
            return this.rbacService.updateRolePermissions(tenantId, roleName, body.permissions);
        }
    };
    return RbacController = _classThis;
})();
exports.RbacController = RbacController;
