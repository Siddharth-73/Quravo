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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
let SubscriptionController = (() => {
    let _classDecorators = [(0, common_1.Controller)('subscriptions')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getMySubscription_decorators;
    let _changePlan_decorators;
    let _getFeatureFlags_decorators;
    let _toggleFeatureFlag_decorators;
    let _handleWebhook_decorators;
    var SubscriptionController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getMySubscription_decorators = [(0, common_1.Get)('me'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
            _changePlan_decorators = [(0, common_1.Post)('change-plan'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('clinic:write')];
            _getFeatureFlags_decorators = [(0, common_1.Get)('feature-flags'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
            _toggleFeatureFlag_decorators = [(0, common_1.Post)('feature-flags/toggle'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('roles:write')];
            _handleWebhook_decorators = [(0, common_1.Post)('webhook'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            __esDecorate(this, null, _getMySubscription_decorators, { kind: "method", name: "getMySubscription", static: false, private: false, access: { has: obj => "getMySubscription" in obj, get: obj => obj.getMySubscription }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _changePlan_decorators, { kind: "method", name: "changePlan", static: false, private: false, access: { has: obj => "changePlan" in obj, get: obj => obj.changePlan }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getFeatureFlags_decorators, { kind: "method", name: "getFeatureFlags", static: false, private: false, access: { has: obj => "getFeatureFlags" in obj, get: obj => obj.getFeatureFlags }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _toggleFeatureFlag_decorators, { kind: "method", name: "toggleFeatureFlag", static: false, private: false, access: { has: obj => "toggleFeatureFlag" in obj, get: obj => obj.toggleFeatureFlag }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _handleWebhook_decorators, { kind: "method", name: "handleWebhook", static: false, private: false, access: { has: obj => "handleWebhook" in obj, get: obj => obj.handleWebhook }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SubscriptionController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        subscriptionService = __runInitializers(this, _instanceExtraInitializers);
        constructor(subscriptionService) {
            this.subscriptionService = subscriptionService;
        }
        async getMySubscription(req) {
            const tenantId = req.user.tenantId;
            return this.subscriptionService.getSubscription(tenantId);
        }
        async changePlan(req, body) {
            const tenantId = req.user.tenantId;
            return this.subscriptionService.changePlan(tenantId, body.newPlanTier);
        }
        async getFeatureFlags(req) {
            const tenantId = req.user.tenantId;
            return this.subscriptionService.getFeatureFlags(tenantId);
        }
        async toggleFeatureFlag(req, body) {
            const tenantId = req.user.tenantId;
            return this.subscriptionService.toggleFeatureFlag(tenantId, body.flagKey, body.enabled);
        }
        async handleWebhook(signature, payload) {
            return this.subscriptionService.handleWebhook(signature, payload);
        }
    };
    return SubscriptionController = _classThis;
})();
exports.SubscriptionController = SubscriptionController;
