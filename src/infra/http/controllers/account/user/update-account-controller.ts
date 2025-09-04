import { UpdateAccountEmailUseCase } from '@/domain/account/user/application/use-cases/account/update-account-email-use-case';
import { UpdateMyAccountUseCase } from '@/domain/account/user/application/use-cases/account/update-my-account-use-case';
import { Account } from '@/domain/account/user/enterprise/entities/account';
import { GetAccount } from '@/infra/http/decorators/get-account';
import { CustomHttpException } from '@/infra/http/exceptions/custom-http-exception';
import { AuthGuard } from '@/infra/http/guards/auth-guard';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { AccountPresenter } from '@/infra/http/presenters/account-presenter';
import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { z } from 'zod';

const bodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional()
});

type BodyDTO = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller('account')
export class UpdateAccountController {
  constructor(
    private updateAccountUseCase: UpdateMyAccountUseCase,
    private updateEmailAccountUseCase: UpdateAccountEmailUseCase
  ) {};

  @Put()
  @UseGuards(AuthGuard)
  async handle (
    @GetAccount() account: Account,
    @Body(bodyValidation) data: BodyDTO
  ) {
    const { name, email, password } = data;

    const accountUpdated = await this.updateAccountUseCase.execute({
      name,
      accountId: account.id.toString()
    }).then(async res => {

      if (email) {
        return await this.updateEmailAccountUseCase.execute({
          accountId: account.id.toString(),
          email,
          password: password || ""
        }).then(res => {
          if (res.isLeft()) {
            throw new CustomHttpException(res.value);
          }
          return res.value.account;
        })
      }

      if (res.isLeft()) {
        throw new CustomHttpException(res.value);
      }

      return res.value.account;
    });

    return {
      account: AccountPresenter.toHTTP(accountUpdated)
    }
  }
}
