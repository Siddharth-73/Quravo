import { Injectable } from '@nestjs/common';
import { notifications, eq, and, desc, count } from '@quravo/db';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class NotificationService {
  constructor(private readonly dbService: DatabaseService) {}

  async getUserNotifications(
    tenantId: string,
    userId: string,
    options: { page: number; limit: number; unreadOnly: boolean },
  ) {
    const { page, limit, unreadOnly } = options;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(notifications.tenantId, tenantId),
      eq(notifications.userId, userId),
    ];

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
  }

  async getUnreadCount(tenantId: string, userId: string) {
    const result = await this.dbService.db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.tenantId, tenantId),
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
        ),
      );

    return { count: result[0]?.count ?? 0 };
  }

  async markAsRead(tenantId: string, userId: string, notificationId: string) {
    await this.dbService.db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.tenantId, tenantId),
          eq(notifications.userId, userId),
        ),
      );

    return { success: true };
  }

  async markAllAsRead(tenantId: string, userId: string) {
    await this.dbService.db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(
        and(
          eq(notifications.tenantId, tenantId),
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
        ),
      );

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
