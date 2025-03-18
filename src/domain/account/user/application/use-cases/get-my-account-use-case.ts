import { Either, left, right } from '@/core/either';
import { Account } from '../../enterprise/entities/account';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account-repository';

interface GetMyAccountUseCaseRequest {
  accountId: string;
}

type GetMyAccountUseCaseResponse = Either<
  null,
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
      return left(null);
    }

    return right({
      account,
    });
  }
}
