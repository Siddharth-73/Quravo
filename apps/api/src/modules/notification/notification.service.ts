import { Injectable, Logger } from '@nestjs/common';
import { notifications, eq, and, desc, count } from '@quravo/db';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async getUserNotifications(
    tenantId: string,
    userId: string,
    options: { page: number; limit: number; unreadOnly: boolean },
  ) {
    const { page, limit, unreadOnly } = options;
    const offset = (page - 1) * limit;

    try {
      if (!userId) return { data: [], total: 0, page, limit };

      const conditions = [
        eq(notifications.userId, userId),
      ];

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (tenantId && uuidRegex.test(tenantId)) {
        conditions.push(eq(notifications.tenantId, tenantId));
      }

      if (unreadOnly) {
        conditions.push(eq(notifications.isRead, false));
      }

      const [data, totalResult] = await Promise.all([
        this.dbService.db
          .select()
          .from(notifications)
          .where(and(...conditions))
          .orderBy(desc(notifications.createdAt))
          .limit(limit)
          .offset(offset),
        this.dbService.db
          .select({ count: count() })
          .from(notifications)
          .where(and(...conditions)),
      ]);

      return {
        data,
        total: totalResult[0]?.count ?? 0,
        page,
        limit,
      };
    } catch (err: any) {
      this.logger.warn(`Could not fetch notifications: ${err?.message}`);
      return { data: [], total: 0, page, limit };
    }
  }

  async getUnreadCount(tenantId: string, userId: string) {
    try {
      if (!userId) return { count: 0 };

      const conditions = [
        eq(notifications.userId, userId),
        eq(notifications.isRead, false),
      ];

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (tenantId && uuidRegex.test(tenantId)) {
        conditions.push(eq(notifications.tenantId, tenantId));
      }

      const result = await this.dbService.db
        .select({ count: count() })
        .from(notifications)
        .where(and(...conditions));

      return { count: result[0]?.count ?? 0 };
    } catch (err: any) {
      this.logger.warn(`Could not fetch unread notification count: ${err?.message}`);
      return { count: 0 };
    }
  }

  async markAsRead(tenantId: string, userId: string, notificationId: string) {
    try {
      if (!userId || !notificationId) return { success: true };
      await this.dbService.db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(
          and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, userId),
          ),
        );
    } catch (err) {}
    return { success: true };
  }

  async markAllAsRead(tenantId: string, userId: string) {
    try {
      if (!userId) return { success: true };
      await this.dbService.db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(
          and(
            eq(notifications.userId, userId),
            eq(notifications.isRead, false),
          ),
        );
    } catch (err) {}
    return { success: true };
  }

  async createNotification(data: {
    tenantId: string;
    userId: string;
    title: string;
    message: string;
    type: string;
  }) {
    const [notification] = await this.dbService.db
      .insert(notifications)
      .values(data)
      .returning();

    return notification;
  }
}
