import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { pushSubscriptions, eq, and } from '@quravo/db';
import * as webpush from 'web-push';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly dbService: DatabaseService,
  ) {
    const vapidSubject = this.configService.get<string>('VAPID_SUBJECT', 'mailto:admin@quravo.test');
    // Using dummy VAPID keys for the MVP if not provided in env
    const vapidPublicKey = this.configService.get<string>('VAPID_PUBLIC_KEY', 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U');
    const vapidPrivateKey = this.configService.get<string>('VAPID_PRIVATE_KEY', '8d-m-YnN4T9K2Q9vHjD1JqLhU-5M6KxZ4nL3X9-1-P0');

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  }

  async saveSubscription(tenantId: string, userId: string, subscription: any) {
    const { endpoint, keys } = subscription;
    const db = this.dbService.db;
    
    this.logger.log(`Saving push subscription for user ${userId} in tenant ${tenantId}`);

    await db.insert(pushSubscriptions).values({
      tenantId,
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    })
    .onConflictDoUpdate({
      target: [pushSubscriptions.userId, pushSubscriptions.endpoint],
      set: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        updatedAt: new Date(),
      }
    });

    return { success: true };
  }

  async sendNotificationToUser(tenantId: string, userId: string, payload: any) {
    const db = this.dbService.db;
    const subscriptions = await db.select().from(pushSubscriptions)
      .where(and(
        eq(pushSubscriptions.tenantId, tenantId),
        eq(pushSubscriptions.userId, userId)
      ));

    if (!subscriptions.length) return;

    this.logger.log(`Sending push notification to user ${userId} (Endpoints: ${subscriptions.length})`);

    const notifications = subscriptions.map(sub => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        }
      };

      return webpush.sendNotification(pushSubscription, JSON.stringify(payload))
        .catch(err => {
          if (err.statusCode === 410) {
            // Subscription has expired or is no longer valid, delete it
            return db.delete(pushSubscriptions)
              .where(eq(pushSubscriptions.id, sub.id));
          }
          this.logger.error('Failed to send push notification', err);
        });
    });

    await Promise.all(notifications);
  }
}
