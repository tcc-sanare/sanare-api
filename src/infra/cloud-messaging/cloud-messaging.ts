import { NotificationProvider, SendNotificationRequest } from "@/domain/notification-provider/notification-provider";
import { Injectable } from "@nestjs/common";
import { App, initializeApp } from "firebase-admin/app";
import { EnvService } from "../env/env.service";
import { credential } from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import { Messaging,  } from "firebase-admin/lib/messaging/messaging";
import { GetDevicesByUserIdUseCase } from "@/domain/account/user/application/use-cases/device/get-devices-by-user-id";
import { Notification } from "@/domain/account/user/enterprise/entities/notification";
import { NotificationRepository } from "@/domain/account/user/application/repositories/notification-repository";

@Injectable()
export class CloudMessaging implements NotificationProvider {
  private messaging: Messaging;

  constructor (
    private envService: EnvService,
    private getDeviceByUserIdUseCase: GetDevicesByUserIdUseCase,
    private notificationRepository: NotificationRepository
  ) {
    // Initialize Firebase app here using envService if needed

    const app = initializeApp({
      credential: credential.cert({
        projectId: this.envService.get('FIREBASE_PROJECT_ID'),
        clientEmail: this.envService.get('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.envService.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      })
    });

    this.messaging = getMessaging(app);
  }

  async sendNotification(request: SendNotificationRequest): Promise<void> {
    const devices = await this.getDeviceByUserIdUseCase.execute({ userId: request.accountId.toString() })
      .then(result => {
        if (result.isLeft()) {
          return [];
        }

        return result.value.devices;
      });

    const tokens = devices.map(device => device.token).filter(token => !!token);
    await this.messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: request.title,
        body: request.body,
      },
      data: request.data,
    });

    await this.notificationRepository.create(Notification.create({
      accountId: request.accountId,
      title: request.title,
      body: request.body,
      data: request.data,
    }));
  }

}