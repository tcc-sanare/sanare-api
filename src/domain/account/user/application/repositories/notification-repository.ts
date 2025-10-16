import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Notification } from "../../enterprise/entities/notification";

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<void>;
  abstract findById(id: UniqueEntityID, accountId: UniqueEntityID): Promise<Notification | null>;
  abstract findByUserId(userId: UniqueEntityID): Promise<Notification[]>;
  abstract delete(notification: Notification): Promise<void>;
}