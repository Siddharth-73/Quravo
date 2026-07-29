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
exports.AppointmentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const module_guard_1 = require("../../common/guards/module.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const module_decorator_1 = require("../../common/decorators/module.decorator");
let AppointmentController = (() => {
    let _classDecorators = [(0, common_1.Controller)('appointments'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, module_guard_1.ModuleGuard, permissions_guard_1.PermissionsGuard), (0, module_decorator_1.RequireModule)('appointments')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getCalendar_decorators;
    let _createAppointment_decorators;
    let _createWalkIn_decorators;
    let _updateStatus_decorators;
    let _getLiveQueue_decorators;
    var AppointmentController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getCalendar_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('appointments:read')];
            _createAppointment_decorators = [(0, common_1.Post)(), (0, permissions_decorator_1.RequirePermissions)('appointments:create')];
            _createWalkIn_decorators = [(0, common_1.Post)('walk-in'), (0, permissions_decorator_1.RequirePermissions)('appointments:create')];
            _updateStatus_decorators = [(0, common_1.Put)(':id/status'), (0, permissions_decorator_1.RequirePermissions)('appointments:write')];
            _getLiveQueue_decorators = [(0, common_1.Get)('queue/live'), (0, permissions_decorator_1.RequirePermissions)('appointments:read')];
            __esDecorate(this, null, _getCalendar_decorators, { kind: "method", name: "getCalendar", static: false, private: false, access: { has: obj => "getCalendar" in obj, get: obj => obj.getCalendar }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createAppointment_decorators, { kind: "method", name: "createAppointment", static: false, private: false, access: { has: obj => "createAppointment" in obj, get: obj => obj.createAppointment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createWalkIn_decorators, { kind: "method", name: "createWalkIn", static: false, private: false, access: { has: obj => "createWalkIn" in obj, get: obj => obj.createWalkIn }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: obj => "updateStatus" in obj, get: obj => obj.updateStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getLiveQueue_decorators, { kind: "method", name: "getLiveQueue", static: false, private: false, access: { has: obj => "getLiveQueue" in obj, get: obj => obj.getLiveQueue }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppointmentController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        appointmentService = __runInitializers(this, _instanceExtraInitializers);
        constructor(appointmentService) {
            this.appointmentService = appointmentService;
        }
        async getCalendar(req, branchId, startDate, endDate, doctorId) {
            const tenantId = req.user.tenantId;
            return this.appointmentService.getAppointmentsCalendar(tenantId, branchId, startDate, endDate, doctorId);
        }
        async createAppointment(req, dto) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            return this.appointmentService.createAppointment(tenantId, userId, dto);
        }
        async createWalkIn(req, dto) {
            const tenantId = req.user.tenantId;
            const userId = req.user.userId;
            return this.appointmentService.createWalkIn(tenantId, userId, dto);
        }
        async updateStatus(req, id, dto) {
            const tenantId = req.user.tenantId;
            return this.appointmentService.updateStatus(tenantId, id, dto);
        }
        async getLiveQueue(req, branchId) {
            const tenantId = req.user.tenantId;
            if (!branchId)
                throw new common_1.NotFoundException('Branch ID parameter is required.');
            return this.appointmentService.getLiveQueue(tenantId, branchId);
        }
    };
    return AppointmentController = _classThis;
})();
exports.AppointmentController = AppointmentController;
