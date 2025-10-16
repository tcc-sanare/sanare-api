import { Notification } from "@/domain/account/user/enterprise/entities/notification";

export class NotificationPresenter {
  static toHTTP(notification: Notification) {
    return {
      id: notification.id.toString(),
      title: notification.title,
      body: notification.body,
      data: notification.data,
      accountId: notification.accountId.toString(),
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }
  }
}