import { NotificationRepository } from "@/domain/account/user/application/repositories/notification-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { Notification } from "@/domain/account/user/enterprise/entities/notification";
import { PrismaNotificationMapper } from "../../mappers/account/prisma-notification-mapper";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor (
    private prisma: PrismaService
  ) {}
;

  async create(notification: Notification): Promise<void> {
    await this.prisma.notifications.create({
      data: PrismaNotificationMapper.toPrisma(notification)
    });
  }

  async findById(id: UniqueEntityID, accountId: UniqueEntityID): Promise<Notification | null> {
    const notification = await this.prisma.notifications.findUnique({
      where: { id: id.toValue(), userId: accountId.toValue() }
    });

    if (!notification) {
      return null;
    }

    return PrismaNotificationMapper.toDomain(notification);
  }

  async findByUserId(accountId: UniqueEntityID): Promise<Notification[]> {
    const notifications = await this.prisma.notifications.findMany({
      where: { userId: accountId.toValue() },
      orderBy: { createdAt: 'desc' }
    });

    return notifications.map(PrismaNotificationMapper.toDomain);
  }

  async delete(notification: Notification): Promise<void> {
    await this.prisma.notifications.delete({
      where: { id: notification.id.toValue() }
    });
  }
}