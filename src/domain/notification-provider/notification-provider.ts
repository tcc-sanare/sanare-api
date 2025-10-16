import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface SendNotificationRequest {
  accountId: UniqueEntityID;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export abstract class NotificationProvider {
  abstract sendNotification(request: SendNotificationRequest): Promise<void>;
}