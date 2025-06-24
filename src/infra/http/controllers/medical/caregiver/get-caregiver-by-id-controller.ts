import { Account } from '@/domain/account/user/enterprise/entities/account';
import { GetCaregiverByUserIdUseCase } from '@/domain/medical/application/use-cases/caregiver/get-caregiver-by-user-id-use-case';
import { GetAccount } from '@/infra/http/decorators/get-account';
import { CustomHttpException } from '@/infra/http/exceptions/custom-http-exception';
import { AuthGuard } from '@/infra/http/guards/auth-guard';
import { CaregiverPresenter } from '@/infra/http/presenters/caregiver-presenter';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('caregiver')
export class GetCaregiverByUserIdController {
  constructor(private getCaregiver: GetCaregiverByUserIdUseCase) {}

  @Get()
  @UseGuards(AuthGuard)
  async handle(@GetAccount() account: Account) {
    const result = await this.getCaregiver.execute({
      userId: account.id.toString(),
    });

    if (result.isLeft()) throw new CustomHttpException(result.value);

    return {
      caregiver: CaregiverPresenter.toHttp(result.value.caregiver),
    };
  }
}
