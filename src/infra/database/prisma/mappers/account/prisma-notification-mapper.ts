import { Notifications as PrismaNotification } from "@prisma/client";
import { Notification } from "@/domain/account/user/enterprise/entities/notification";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaNotificationMapper {
  static toDomain(prismaNotification: PrismaNotification): Notification {
    return Notification.create({
      title: prismaNotification.title,
      body: prismaNotification.body,
      accountId: new UniqueEntityID(prismaNotification.userId),
      data: prismaNotification.data as Record<string, any> ?? {},
      createdAt: prismaNotification.createdAt,
      updatedAt: prismaNotification.updatedAt ?? undefined,
    }, new UniqueEntityID(prismaNotification.id));
  }

  static toPrisma(notification: Notification): PrismaNotification {
    return {
      id: notification.id.toValue(),
      title: notification.title,
      body: notification.body,
      userId: notification.accountId.toValue(),
      data: notification.data,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt ?? null,
    };
  }
}