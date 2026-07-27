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
import { AiModule } from './modules/ai/ai.module';
import { ExportModule } from './modules/export/export.module';
import { CorrelationContextMiddleware } from './common/middleware/correlation-context.middleware';
import { TenantResolverMiddleware } from './common/middleware/tenant-resolver.middleware';
import { RequestContext } from '@quravo/common';

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
    AiModule,
    ExportModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationContextMiddleware, TenantResolverMiddleware).forRoutes('*');
  }
}
