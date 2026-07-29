import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './queue/queue.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { ClinicModule } from './modules/clinic/clinic.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PatientModule } from './modules/patient/patient.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { EmrModule } from './modules/emr/emr.module';
import { BillingModule } from './modules/billing/billing.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PushModule } from './modules/push/push.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AiModule } from './modules/ai/ai.module';
import { ExportModule } from './modules/export/export.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { LaboratoryModule } from './modules/laboratory/laboratory.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { HrModule } from './modules/hr/hr.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { BedManagementModule } from './modules/bed-management/bed-management.module';
import { PatientPlatformModule } from './modules/patient-platform/patient-platform.module';
import { AuditModule } from './modules/audit/audit.module';
import { CorrelationContextMiddleware } from './common/middleware/correlation-context.middleware';
import { TenantResolverMiddleware } from './common/middleware/tenant-resolver.middleware';
import { RequestContext } from '@quravo/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        customProps: () => ({
          requestId: RequestContext.requestId,
          tenantId: RequestContext.tenantId,
          userId: RequestContext.userId,
        }),
      },
    }),
    DatabaseModule,
    QueueModule,
    HealthModule,
    MetricsModule,
    AuthModule,
    TenantModule,
    SuperAdminModule,
    RbacModule,
    ClinicModule,
    SubscriptionModule,
    PatientModule,
    AppointmentModule,
    EmrModule,
    BillingModule,
    RealtimeModule,
    AnalyticsModule,
    PushModule,
    NotificationModule,
    AiModule,
    ExportModule,
    PharmacyModule,
    LaboratoryModule,
    ProcurementModule,
    InventoryModule,
    InsuranceModule,
    HrModule,
    PayrollModule,
    BedManagementModule,
    PatientPlatformModule,
    AuditModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 300,
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationContextMiddleware, TenantResolverMiddleware).forRoutes('*');
  }
}
