import { Account } from '@/domain/account/user/enterprise/entities/account';
import { CreateCaregiverUseCase } from '@/domain/medical/application/use-cases/caregiver/create-caregiver-use-case';
import { GetAccount } from '@/infra/http/decorators/get-account';
import { CustomHttpException } from '@/infra/http/exceptions/custom-http-exception';
import { AuthGuard } from '@/infra/http/guards/auth-guard';
import { CaregiverPresenter } from '@/infra/http/presenters/caregiver-presenter';
import { Controller, Post, UseGuards } from '@nestjs/common';

@Controller('caregiver')
export class CreateCaregiverController {
  constructor(private createCaregiver: CreateCaregiverUseCase) {}

  @Post()
  @UseGuards(AuthGuard)
  async handle(@GetAccount() account: Account) {
    const result = await this.createCaregiver.execute({
        userId: account.id.toValue()
    })

    if(result.isLeft()) throw new CustomHttpException(result.value)

    return {
        caregiver: CaregiverPresenter.toHttp(result.value.caregiver)
    }
  }
}
