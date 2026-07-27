import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { DefaultProcessor } from './processors/default.processor';
import { EmailProcessor } from './processors/email.processor';
import { EmailProvider } from './providers/email.provider';
import { ReminderProcessor } from './processors/reminder.processor';
import { NotificationProcessor } from './processors/notification.processor';
import { AnalyticsProcessor } from './processors/analytics.processor';
import { AiProcessor } from './processors/ai.processor';
import { ExportProcessor } from './processors/export.processor';
import { AiService } from './providers/ai/ai.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),
  ],
  providers: [
    DefaultProcessor, 
    EmailProcessor, 
    EmailProvider, 
    ReminderProcessor, 
    NotificationProcessor, 
    AnalyticsProcessor,
    AiProcessor,
    ExportProcessor,
    AiService,
  ],
})
export class WorkerModule {}
