import { Account } from '@/domain/account/user/enterprise/entities/account';
import { GetCaregiverByUserIdUseCase } from '@/domain/medical/application/use-cases/caregiver/get-caregiver-by-user-id-use-case';
import { GetSelfMonitorsByCaregiverIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitors-by-caregiver-id-use-case';
import { GetAccount } from '@/infra/http/decorators/get-account';
import { CustomHttpException } from '@/infra/http/exceptions/custom-http-exception';
import { AuthGuard } from '@/infra/http/guards/auth-guard';
import { SelfMonitorPresenter } from '@/infra/http/presenters/self-monitor-presenter';
import { Controller, UseGuards, Get } from '@nestjs/common';

@Controller('caregiver/self-monitors')
export class GetSelfMonitorByCaregiverIdController {
  constructor(
    private getSelfMonitor: GetSelfMonitorsByCaregiverIdUseCase,
    private getCaregiver: GetCaregiverByUserIdUseCase,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async handle(@GetAccount() account: Account) {
    const caregiverId = await this.getCaregiver.execute({
      userId: account.id.toString(),
    });

    if (caregiverId.isLeft()) throw new CustomHttpException(caregiverId.value);

    const selfMonitors = await this.getSelfMonitor.execute({
      caregiverId: caregiverId.value.caregiver.id.toString(),
    })
    .then(result => {
        if (result.isLeft()) throw new CustomHttpException(result.value);
        return result.value.selfMonitors
    })

    return {
      selfMonitors: selfMonitors.map(SelfMonitorPresenter.toHttp)
    };
  }
}
