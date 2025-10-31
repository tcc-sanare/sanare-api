import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { NotificationRepository } from "../../repositories/notification-repository";

interface DeleteNotificationUseCaseRequest {
  notificationId: UniqueEntityID;
  accountId: UniqueEntityID;
}

type DeleteNotificationUseCaseResponse = Either<
  NotAllowedError<DeleteNotificationUseCaseRequest>,
  {}
>;

@Injectable()
export class DeleteNotificationUseCase {
  constructor(
    private notificationRepository: NotificationRepository
  ) {}

  async execute({
    notificationId,
    accountId,
  }: DeleteNotificationUseCaseRequest): Promise<DeleteNotificationUseCaseResponse> {
    const notification = await this.notificationRepository.findById(notificationId, accountId);

    if (!notification) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [
          {
            message: "Notificação não encontrada",
          }
        ]
      }));
    }

    await this.notificationRepository.delete(notification);

    return right({});
  }
}