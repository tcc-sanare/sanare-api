import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAccount } from '../../../decorators/get-account';
import { Account } from '@/domain/account/user/enterprise/entities/account';
import { GetSelfMonitorByAccountIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case';
import { AuthGuard } from '../../../guards/auth-guard';
import { SelfMonitorPresenter } from '../../../presenters/self-monitor-presenter';
import { CustomHttpException } from '../../../exceptions/custom-http-exception';

@Controller('self-monitor')
export class GetSelfMonitorController {
  constructor(private getSelfMonitor: GetSelfMonitorByAccountIdUseCase) {}

  @Get()
  @UseGuards(AuthGuard)
  async handle(@GetAccount() account: Account) {
    const result = await this.getSelfMonitor.execute({
      accountId: account.id,
    });

    if (result.isLeft()) throw new CustomHttpException(result.value);

    return {
      selfMonitor: SelfMonitorPresenter.toHTTP(result.value.selfMonitor),
    };
  }
}
