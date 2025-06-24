import { Either, left, right } from '@/core/either';
import { Account } from '../../../enterprise/entities/account';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../repositories/account-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { GetSelfMonitorByAccountIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case';
import { GetCaregiverByUserIdUseCase } from '@/domain/medical/application/use-cases/caregiver/get-caregiver-by-user-id-use-case';
import { Caregiver } from '@/domain/medical/enterprise/entities/caregiver';
import { SelfMonitor } from '@/domain/medical/enterprise/entities/self-monitor';

interface GetMyAccountUseCaseRequest {
  accountId: string;
}

type GetMyAccountUseCaseResponse = Either<
  ResourceNotFoundError<GetMyAccountUseCaseRequest>,
  {
    account: Account;
    caregiver?: Caregiver;
    selfMonitor?: SelfMonitor;
  }
>;

@Injectable()
export class GetMyAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private getSelfMonitorUseCase: GetSelfMonitorByAccountIdUseCase,
    private getCaregiverUseCase: GetCaregiverByUserIdUseCase
  ) {}

  async execute(
    request: GetMyAccountUseCaseRequest,
  ): Promise<GetMyAccountUseCaseResponse> {
    const account = await this.accountRepository.findById(request.accountId);

    if (!account) {
      return left(new ResourceNotFoundError<GetMyAccountUseCaseRequest>({
        errors: [
          {
            message: 'Conta não encontrada',
          },
        ],
      }));
    }

    return right({
      account,
      selfMonitor: await this.getSelfMonitorUseCase.execute({
        accountId: account.id,
      }).then(result => result.isRight() ? result.value.selfMonitor : null),
      caregiver: await this.getCaregiverUseCase.execute({
        userId: account.id.toString(),
      }).then(result => result.isRight() ? result.value.caregiver : null),
    });
  }
}
