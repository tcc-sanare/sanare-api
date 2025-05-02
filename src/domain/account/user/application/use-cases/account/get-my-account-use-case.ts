import { Either, left, right } from '@/core/either';
import { Account } from '../../../enterprise/entities/account';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../repositories/account-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface GetMyAccountUseCaseRequest {
  accountId: string;
}

type GetMyAccountUseCaseResponse = Either<
  ResourceNotFoundError<GetMyAccountUseCaseRequest>,
  {
    account: Account;
  }
>;

@Injectable()
export class GetMyAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

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
    });
  }
}
