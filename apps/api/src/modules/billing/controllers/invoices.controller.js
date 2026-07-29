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
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const module_guard_1 = require("../../../common/guards/module.guard");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const module_decorator_1 = require("../../../common/decorators/module.decorator");
let InvoicesController = (() => {
    let _classDecorators = [(0, common_1.Controller)('invoices'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, module_guard_1.ModuleGuard, permissions_guard_1.PermissionsGuard), (0, module_decorator_1.RequireModule)('billing')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _listInvoices_decorators;
    let _getInvoice_decorators;
    let _createInvoice_decorators;
    var InvoicesController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _listInvoices_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('billing:read')];
            _getInvoice_decorators = [(0, common_1.Get)(':id'), (0, permissions_decorator_1.RequirePermissions)('billing:read')];
            _createInvoice_decorators = [(0, common_1.Post)(), (0, permissions_decorator_1.RequirePermissions)('billing:create')];
            __esDecorate(this, null, _listInvoices_decorators, { kind: "method", name: "listInvoices", static: false, private: false, access: { has: obj => "listInvoices" in obj, get: obj => obj.listInvoices }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getInvoice_decorators, { kind: "method", name: "getInvoice", static: false, private: false, access: { has: obj => "getInvoice" in obj, get: obj => obj.getInvoice }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createInvoice_decorators, { kind: "method", name: "createInvoice", static: false, private: false, access: { has: obj => "createInvoice" in obj, get: obj => obj.createInvoice }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            InvoicesController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        invoicesService = __runInitializers(this, _instanceExtraInitializers);
        constructor(invoicesService) {
            this.invoicesService = invoicesService;
        }
        async listInvoices(req) {
            const tenantId = req.user.tenantId;
            return this.invoicesService.listInvoices(tenantId);
        }
        async getInvoice(req, id) {
            const tenantId = req.user.tenantId;
            return this.invoicesService.getInvoice(tenantId, id);
        }
        async createInvoice(req, dto) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            return this.invoicesService.createInvoice(tenantId, userId, dto);
        }
    };
    return InvoicesController = _classThis;
})();
exports.InvoicesController = InvoicesController;
