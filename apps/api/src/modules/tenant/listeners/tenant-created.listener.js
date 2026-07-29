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
exports.TenantCreatedListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const db_1 = require("@quravo/db");
let TenantCreatedListener = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _handleTenantCreated_decorators;
    var TenantCreatedListener = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _handleTenantCreated_decorators = [(0, event_emitter_1.OnEvent)('tenant.created')];
            __esDecorate(this, null, _handleTenantCreated_decorators, { kind: "method", name: "handleTenantCreated", static: false, private: false, access: { has: obj => "handleTenantCreated" in obj, get: obj => obj.handleTenantCreated }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TenantCreatedListener = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService = __runInitializers(this, _instanceExtraInitializers);
        queueService;
        rbacService;
        clinicService;
        subscriptionService;
        logger = new common_1.Logger(TenantCreatedListener.name);
        constructor(dbService, queueService, rbacService, clinicService, subscriptionService) {
            this.dbService = dbService;
            this.queueService = queueService;
            this.rbacService = rbacService;
            this.clinicService = clinicService;
            this.subscriptionService = subscriptionService;
        }
        async handleTenantCreated(event) {
            this.logger.log(`🎉 Handling TenantCreatedEvent for clinic: ${event.data.name} [ID: ${event.data.tenantId}]`);
            const db = this.dbService.db;
            // Seed default platform RBAC roles
            const defaultRoles = [
                { name: 'owner', description: 'Clinic Owner & Administrator', permissions: ['*'] },
                { name: 'admin', description: 'Clinic Operations Administrator', permissions: ['users:read', 'users:write', 'appointments:*', 'patients:*'] },
                { name: 'doctor', description: 'Medical Doctor / Physician', permissions: ['appointments:*', 'patients:*', 'emr:*', 'prescriptions:*'] },
                { name: 'nurse', description: 'Nursing & Clinical Staff', permissions: ['patients:read', 'appointments:read', 'vitals:write'] },
                { name: 'receptionist', description: 'Front Desk & Patient Intake', permissions: ['appointments:*', 'patients:read', 'patients:write'] },
                { name: 'accountant', description: 'Billing & Financial Manager', permissions: ['billing:*', 'reports:read'] },
                { name: 'staff', description: 'General Staff Member', permissions: ['appointments:read'] },
                { name: 'patient', description: 'Patient Portal Account', permissions: ['portal:*'] },
            ];
            try {
                await db.insert(db_1.roles).values(defaultRoles.map((role) => ({
                    tenantId: event.data.tenantId,
                    name: role.name,
                    description: role.description,
                    permissions: role.permissions,
                })));
                this.logger.log(`✅ Default RBAC roles seeded for tenant ${event.data.slug}`);
                // Seed tier-based tenant modules
                await this.rbacService.seedInitialTenantModules(event.data.tenantId, event.data.planTier);
                this.logger.log(`✅ Default tier modules seeded for tenant ${event.data.slug} [Plan: ${event.data.planTier}]`);
                // Seed Main Branch & Working Hours
                await this.clinicService.seedMainBranch(event.data.tenantId, event.data.name);
                this.logger.log(`✅ Main Branch & default operating hours seeded for tenant ${event.data.slug}`);
                // Seed 14-Day Free Trial Subscription
                await this.subscriptionService.seedTrialSubscription(event.data.tenantId, event.data.planTier);
                this.logger.log(`✅ 14-Day Free Trial subscription seeded for tenant ${event.data.slug}`);
            }
            catch (err) {
                this.logger.error(`Failed to seed RBAC roles/modules/branches/subscriptions for tenant ${event.data.tenantId}: ${err.message}`);
            }
            // Enqueue onboarding welcome email job
            try {
                await this.queueService.addJob('welcome-clinic', {
                    type: 'welcome-clinic',
                    to: event.data.ownerEmail,
                    subject: `Welcome to Quravo Platform — ${event.data.name}`,
                    firstName: event.data.name,
                    verificationUrl: `http://${event.data.slug}.localhost:3000/dashboard`,
                });
                this.logger.log(`📧 Onboarding email queued for clinic owner ${event.data.ownerEmail}`);
            }
            catch (err) {
                this.logger.error(`Failed to queue onboarding email: ${err.message}`);
            }
        }
    };
    return TenantCreatedListener = _classThis;
})();
exports.TenantCreatedListener = TenantCreatedListener;
