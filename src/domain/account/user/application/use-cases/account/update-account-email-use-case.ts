import { Either, left, right } from '@/core/either';
import { Account } from '../../../enterprise/entities/account';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../repositories/account-repository';
import { HashComparer } from '@/domain/account/cryptography/hash-comparer';

interface UpdateAccountEmailUseCaseRequest {
  accountId: string;
  email: string;
  password: string;
}

type UpdateAccountEmailUseCaseResponse = Either<
  null,
  {
    account: Account;
  }
>;

@Injectable()
export class UpdateAccountEmailUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private hashComparer: HashComparer,
  ) {}

  async execute(
    data: UpdateAccountEmailUseCaseRequest,
  ): Promise<UpdateAccountEmailUseCaseResponse> {
    const account = await this.accountRepository.findById(data.accountId);

    if (!account) {
      return left(null);
    }

    const passwordMatch = await this.hashComparer.compare(
      data.password,
      account.password,
    );

    if (!passwordMatch) {
      return left(null);
    }

    account.email = data.email;
    account.isVerified = false;

    return right({
      account,
    });
  }
}
