import { Either, left, right } from '@/core/either';
import { Account } from '../../../enterprise/entities/account';
import { AccountRepository } from '../../repositories/account-repository';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '../../../../cryptography/hash-generetor';

interface CreateAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
  cep: string;
}

type CreateAccountUseCaseResponse = Either<
  null,
  {
    account: Account;
  }
>;

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: CreateAccountUseCaseRequest,
  ): Promise<CreateAccountUseCaseResponse> {
    const account = Account.create({
      name: request.name,
      email: request.email,
      password: await this.hashGenerator.hash(request.password),
      isVerified: false,
      profilePhotoKey: null,
      cep: request.cep,
    });

    if (!account) {
      return left(null);
    }

    if (await this.accountRepository.findByEmail(account.email)) {
      return left(null);
    }

    await this.accountRepository.create(account);

    return right({
      account,
    });
  }
}
