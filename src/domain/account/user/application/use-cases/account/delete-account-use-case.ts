import { Either, left, right } from '@/core/either';
import { Account } from '../../../enterprise/entities/account';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../repositories/account-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { D } from 'vitest/dist/chunks/reporters.66aFHiyX';

interface DeleteAccountUseCaseRequest {
  accountId: string;
}

type DeleteAccountUseCaseResponse = Either<
  NotAllowedError<DeleteAccountUseCaseRequest>,
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
      return left(new NotAllowedError<DeleteAccountUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Conta não encontrada'
          },
        ],
      }));
    }

    await this.accountRepository.delete(account);

    return right({
      account,
    });
  }
}
