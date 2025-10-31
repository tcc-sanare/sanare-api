import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAccount } from '../../../decorators/get-account';
import { Account } from '@/domain/account/user/enterprise/entities/account';
import { GetSelfMonitorByAccountIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case';
import { AuthGuard } from '../../../guards/auth-guard';
import { SelfMonitorPresenter } from '../../../presenters/self-monitor-presenter';
import { CustomHttpException } from '../../../exceptions/custom-http-exception';
import { CaregiverPresenter } from '@/infra/http/presenters/caregiver-presenter';
import { GetCaregiverByIdUseCase } from '@/domain/medical/application/use-cases/caregiver/get-caregiver-by-id-use-case';
import { GetMyAccountUseCase } from '@/domain/account/user/application/use-cases/account/get-my-account-use-case';
import { AccountPresenter } from '@/infra/http/presenters/account-presenter';

@Controller('self-monitor')
export class GetSelfMonitorController {
  constructor(
    private getSelfMonitor: GetSelfMonitorByAccountIdUseCase,
    private getCaregiverById: GetCaregiverByIdUseCase,
    private getAccountById: GetMyAccountUseCase
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async handle(@GetAccount() account: Account) {
    const result = await this.getSelfMonitor.execute({
      accountId: account.id,
    });

    if (result.isLeft()) throw new CustomHttpException(result.value);

    const caregiver = result.value.selfMonitor.caregiverId ? await this.getCaregiverById.execute({
        id: result.value.selfMonitor.caregiverId.toString()
      }).then(res => {
        if (res.isLeft()) return null;
        return res.value.caregiver;
      }) : null;

    return {
      selfMonitor: {
        ...SelfMonitorPresenter.toHTTP(result.value.selfMonitor),
        caregiver: result.value.selfMonitor.caregiverId
          ? await AccountPresenter.toHTTP(
              await this.getAccountById.execute({
                accountId: caregiver.userId.toString()
              }).then(res => {
                if (res.isLeft()) throw new CustomHttpException(res.value);
                return res.value.account;
              })
            )
          : null,
      },
    };
  }
}
