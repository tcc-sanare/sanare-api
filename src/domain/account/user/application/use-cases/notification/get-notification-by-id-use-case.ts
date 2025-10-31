import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { NotificationRepository } from "../../repositories/notification-repository";
import { Notification } from "../../../enterprise/entities/notification";

interface GetNotificationByIdUseCaseRequest {
  notificationId: UniqueEntityID;
  accountId: UniqueEntityID;
}

type GetNotificationByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetNotificationByIdUseCaseRequest>,
  {
    notification: Notification;
  }
>;

@Injectable()
export class GetNotificationByIdUseCase {
  constructor(
    private notificationRepository: NotificationRepository
  ) {}

  async execute({
    notificationId,
    accountId,
  }: GetNotificationByIdUseCaseRequest): Promise<GetNotificationByIdUseCaseResponse> {
    const notification = await this.notificationRepository.findById(notificationId, accountId);

    if (!notification) {
      return left(new ResourceNotFoundError({
        errors: [
          {
            message: "Notificação não encontrada",
          }
        ]
      }));
    }

    return right({
      notification,
    });
  }
}