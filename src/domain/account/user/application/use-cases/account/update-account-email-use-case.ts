import { Either, left, right } from '@/core/either';
import { Account } from '../../../enterprise/entities/account';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../repositories/account-repository';
import { HashComparer } from '@/domain/account/cryptography/hash-comparer';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface UpdateAccountEmailUseCaseRequest {
  accountId: string;
  email: string;
  password: string;
}

type UpdateAccountEmailUseCaseResponse = Either<
  NotAllowedError<UpdateAccountEmailUseCaseRequest>,
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
      return left(new NotAllowedError<UpdateAccountEmailUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Conta não encontrada',
          },
        ],
      }));
    }

    const passwordMatch = await this.hashComparer.compare(
      data.password,
      account.password,
    );

    if (!passwordMatch) {
      return left(new NotAllowedError<UpdateAccountEmailUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Senha incorreta',
            path: ['password']
          },
        ],
      }));
    }

    account.email = data.email;
    account.isVerified = false;

    return right({
      account,
    });
  }
}
