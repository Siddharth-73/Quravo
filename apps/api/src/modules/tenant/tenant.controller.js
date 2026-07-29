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
exports.TenantController = void 0;
const common_1 = require("@nestjs/common");
let TenantController = (() => {
    let _classDecorators = [(0, common_1.Controller)('tenants')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _resolveTenant_decorators;
    let _getCurrentTenant_decorators;
    var TenantController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _resolveTenant_decorators = [(0, common_1.Get)('resolve')];
            _getCurrentTenant_decorators = [(0, common_1.Get)('current')];
            __esDecorate(this, null, _resolveTenant_decorators, { kind: "method", name: "resolveTenant", static: false, private: false, access: { has: obj => "resolveTenant" in obj, get: obj => obj.resolveTenant }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getCurrentTenant_decorators, { kind: "method", name: "getCurrentTenant", static: false, private: false, access: { has: obj => "getCurrentTenant" in obj, get: obj => obj.getCurrentTenant }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TenantController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        tenantService = __runInitializers(this, _instanceExtraInitializers);
        constructor(tenantService) {
            this.tenantService = tenantService;
        }
        async resolveTenant(slug) {
            if (!slug) {
                throw new common_1.NotFoundException('Subdomain slug parameter is required.');
            }
            return this.tenantService.getTenantBySlug(slug);
        }
        async getCurrentTenant(req) {
            if (!req.tenant) {
                throw new common_1.NotFoundException('No active tenant context resolved for request.');
            }
            return { tenant: req.tenant };
        }
    };
    return TenantController = _classThis;
})();
exports.TenantController = TenantController;
