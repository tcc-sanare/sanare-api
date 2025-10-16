import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Notification } from "../../../enterprise/entities/notification";
import { Injectable } from "@nestjs/common";
import { NotificationRepository } from "../../repositories/notification-repository";

interface GetNotificationsByAccountIdUseCaseRequest {
  accountId: UniqueEntityID;
}

type GetNotificationsByAccountIdUseCaseResponse = Either<
  null,
  {
    notifications: Notification[];
  }
>;

@Injectable()
export class GetNotificationsByAccountIdUseCase {
  constructor(
    private notificationRepository: NotificationRepository
  ) {}

  async execute({
    accountId,
  }: GetNotificationsByAccountIdUseCaseRequest): Promise<GetNotificationsByAccountIdUseCaseResponse> {
    const notifications = await this.notificationRepository.findByUserId(accountId);

    return right({
      notifications,
    });
  }
}