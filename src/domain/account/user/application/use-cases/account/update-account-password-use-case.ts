import { Either, left, right } from '@/core/either';
import { Account } from '../../../enterprise/entities/account';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../repositories/account-repository';
import { HashComparer } from '@/domain/account/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/account/cryptography/hash-generetor';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface UpdateAccountPasswordUseCaseRequest {
  accountId: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

type UpdateAccountPasswordUseCaseResponse = Either<
  NotAllowedError<UpdateAccountPasswordUseCaseRequest>,
  {
    account: Account;
  }
>;

@Injectable()
export class UpdateAccountPasswordUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    data: UpdateAccountPasswordUseCaseRequest,
  ): Promise<UpdateAccountPasswordUseCaseResponse> {
    const account = await this.accountRepository.findById(data.accountId);

    if (!account) {
      return left(new NotAllowedError<UpdateAccountPasswordUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Conta não encontrada',
          },
        ],
      }));
    }

    const passwordCompare = await this.hashComparer.compare(
      data.oldPassword,
      account.password,
    );

    if (!passwordCompare) {
      return left(new NotAllowedError<UpdateAccountPasswordUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Senha incorreta',
            path: ['oldPassword'],
          },
        ],
      }));
    }

    if (data.password !== data.confirmPassword) {
      return left(new NotAllowedError<UpdateAccountPasswordUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'As senhas não conferem',
            path: ['password', 'confirmPassword'],
          },
        ],
      }));
    }

    account.password = await this.hashGenerator.hash(data.password);

    await this.accountRepository.save(account);

    return right({
      account,
    });
  }
}
