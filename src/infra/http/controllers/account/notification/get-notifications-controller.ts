import { GetNotificationsByAccountIdUseCase } from "@/domain/account/user/application/use-cases/notification/get-notifications-by-account-id-use-case";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { NotificationPresenter } from "@/infra/http/presenters/notification-presenter";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("notifications")
export class GetNotificationsController {
  constructor (
    private getNotificationsByAccountIdUseCase: GetNotificationsByAccountIdUseCase
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async handle (
    @GetAccount() account: Account
  ) {
    const notifications = await this.getNotificationsByAccountIdUseCase.execute({
      accountId: account.id
    }).then(result => {
      if (result.isLeft()) {
        throw new CustomHttpException(result.value);
      }

      return result.value.notifications;
    });
    
    return { notifications: notifications.map(NotificationPresenter.toHTTP) };
  }
}