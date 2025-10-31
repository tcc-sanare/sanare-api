import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DeleteNotificationUseCase } from "@/domain/account/user/application/use-cases/notification/delete-notification-use-case";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Controller, Delete, UseGuards, Param } from "@nestjs/common";
import { z } from "zod";

const paramSchema = z.object({
  id: z.string().uuid().transform(id => new UniqueEntityID(id)),
});

type ParamDto = z.infer<typeof paramSchema>;

const paramValidation = new ZodValidationPipe(paramSchema);

@Controller("notifications/:id")
export class DeleteNotificationController {
  constructor (
    private deleteNotificationUseCase: DeleteNotificationUseCase
  ) {}

  @Delete()
  @UseGuards(AuthGuard)
  async handle (
    @GetAccount() account: Account,
    @Param(paramValidation) params: ParamDto
  ) {
    await this.deleteNotificationUseCase.execute({
      accountId: account.id,
      notificationId: params.id
    }).then(result => {
      if (result.isLeft()) {
        throw new CustomHttpException(result.value);
      }
    });
  }
}