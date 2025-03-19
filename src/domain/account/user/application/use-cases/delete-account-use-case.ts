import { Either, left, right } from '@/core/either';
import { Account } from '../../enterprise/entities/account';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account-repository';

interface DeleteAccountUseCaseRequest {
  accountId: string;
}

type DeleteAccountUseCaseResponse = Either<
  null,
  {
    account: Account;
  }
>;

@Injectable()
export class DeleteAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute(
    request: DeleteAccountUseCaseRequest,
  ): Promise<DeleteAccountUseCaseResponse> {
    const account = await this.accountRepository.findById(request.accountId);

    if (!account) {
      return left(null);
    }

    await this.accountRepository.delete(account);

    return right({
      account,
    });
  }
}
