"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const nestjs_pino_1 = require("nestjs-pino");
const database_module_1 = require("./database/database.module");
const queue_module_1 = require("./queue/queue.module");
const health_module_1 = require("./health/health.module");
const metrics_module_1 = require("./metrics/metrics.module");
const auth_module_1 = require("./modules/auth/auth.module");
const tenant_module_1 = require("./modules/tenant/tenant.module");
const super_admin_module_1 = require("./modules/super-admin/super-admin.module");
const rbac_module_1 = require("./modules/rbac/rbac.module");
const clinic_module_1 = require("./modules/clinic/clinic.module");
const subscription_module_1 = require("./modules/subscription/subscription.module");
const patient_module_1 = require("./modules/patient/patient.module");
const appointment_module_1 = require("./modules/appointment/appointment.module");
const emr_module_1 = require("./modules/emr/emr.module");
const billing_module_1 = require("./modules/billing/billing.module");
const realtime_module_1 = require("./modules/realtime/realtime.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const push_module_1 = require("./modules/push/push.module");
const notification_module_1 = require("./modules/notification/notification.module");
const ai_module_1 = require("./modules/ai/ai.module");
const export_module_1 = require("./modules/export/export.module");
const pharmacy_module_1 = require("./modules/pharmacy/pharmacy.module");
const laboratory_module_1 = require("./modules/laboratory/laboratory.module");
const procurement_module_1 = require("./modules/procurement/procurement.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const insurance_module_1 = require("./modules/insurance/insurance.module");
const hr_module_1 = require("./modules/hr/hr.module");
const payroll_module_1 = require("./modules/payroll/payroll.module");
const bed_management_module_1 = require("./modules/bed-management/bed-management.module");
const patient_platform_module_1 = require("./modules/patient-platform/patient-platform.module");
const audit_module_1 = require("./modules/audit/audit.module");
const correlation_context_middleware_1 = require("./common/middleware/correlation-context.middleware");
const tenant_resolver_middleware_1 = require("./common/middleware/tenant-resolver.middleware");
const common_2 = require("@quravo/common");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const audit_interceptor_1 = require("./common/interceptors/audit.interceptor");
let AppModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                }),
                event_emitter_1.EventEmitterModule.forRoot(),
                nestjs_pino_1.LoggerModule.forRoot({
                    pinoHttp: {
                        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
                        transport: process.env.NODE_ENV !== 'production'
                            ? { target: 'pino-pretty', options: { colorize: true } }
                            : undefined,
                        customProps: () => ({
                            requestId: common_2.RequestContext.requestId,
                            tenantId: common_2.RequestContext.tenantId,
                            userId: common_2.RequestContext.userId,
                        }),
                    },
                }),
                database_module_1.DatabaseModule,
                queue_module_1.QueueModule,
                health_module_1.HealthModule,
                metrics_module_1.MetricsModule,
                auth_module_1.AuthModule,
                tenant_module_1.TenantModule,
                super_admin_module_1.SuperAdminModule,
                rbac_module_1.RbacModule,
                clinic_module_1.ClinicModule,
                subscription_module_1.SubscriptionModule,
                patient_module_1.PatientModule,
                appointment_module_1.AppointmentModule,
                emr_module_1.EmrModule,
                billing_module_1.BillingModule,
                realtime_module_1.RealtimeModule,
                analytics_module_1.AnalyticsModule,
                push_module_1.PushModule,
                notification_module_1.NotificationModule,
                ai_module_1.AiModule,
                export_module_1.ExportModule,
                pharmacy_module_1.PharmacyModule,
                laboratory_module_1.LaboratoryModule,
                procurement_module_1.ProcurementModule,
                inventory_module_1.InventoryModule,
                insurance_module_1.InsuranceModule,
                hr_module_1.HrModule,
                payroll_module_1.PayrollModule,
                bed_management_module_1.BedManagementModule,
                patient_platform_module_1.PatientPlatformModule,
                audit_module_1.AuditModule,
                throttler_1.ThrottlerModule.forRoot([{
                        ttl: 60000,
                        limit: 300,
                    }]),
            ],
            providers: [
                {
                    provide: core_1.APP_GUARD,
                    useClass: throttler_1.ThrottlerGuard,
                },
                {
                    provide: core_1.APP_INTERCEPTOR,
                    useClass: audit_interceptor_1.AuditInterceptor,
                },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configure(consumer) {
            consumer.apply(correlation_context_middleware_1.CorrelationContextMiddleware, tenant_resolver_middleware_1.TenantResolverMiddleware).forRoutes('*');
        }
    };
    return AppModule = _classThis;
})();
exports.AppModule = AppModule;
